unit uTestThreadSafeSingleton;

interface

uses
  TestFramework, uThreadSafeSingleton;

type
  // Define a test fixture for the TThreadSafeSingleton class
  TTestThreadSafeSingleton = class(TTestCase)
  private
    FSingleton: TThreadSafeSingleton;
  public
    procedure SetUp; override;
    procedure TearDown; override;
  published
    procedure TestGetInstance;
    procedure TestAddToken;
    procedure TestRemoveToken;
    procedure TestTokenExists;
    procedure TestGetTokenCount;
    procedure TestContainsToken;
    procedure TestAddDuplicateToken;
    procedure TestRemoveNonExistentToken;
    procedure TestAddAndRemoveTokensConcurrentlyWithTasks;
    procedure TestAddAndRemoveTokensConcurrentlyWithParallel;
    procedure TestAddAndRemoveTokensConcurrentlyWithThreads;
  end;

implementation
uses
  System.Classes, System.Threading, System.SysUtils;

procedure TTestThreadSafeSingleton.SetUp;
begin
  FSingleton := TThreadSafeSingleton.Instance;
end;

procedure TTestThreadSafeSingleton.TestGetInstance;
var
  Instance1, Instance2: TThreadSafeSingleton;
begin
  // Test that only one instance of the singleton can be created
  Instance1 := TThreadSafeSingleton.Instance;
  Instance2 := TThreadSafeSingleton.Instance;
  CheckTrue(Instance1 = Instance2);
end;

procedure TTestThreadSafeSingleton.TestAddToken;
begin
  // Test adding a token to the singleton's Tokens list
  FSingleton.AddToken('foo');
  CheckEquals(1, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestRemoveToken;
begin
  // Test removing a token from the singleton's Tokens list
  FSingleton.AddToken('foo');
  FSingleton.AddToken('bar');
  FSingleton.RemoveToken('foo');
  CheckEquals(1, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestTokenExists;
begin
  // Test checking if a token exists in the singleton's Tokens list
  FSingleton.AddToken('foo');
  CheckTrue(FSingleton.TokenExists('foo'));
  CheckFalse(FSingleton.TokenExists('bar'));
end;

procedure TTestThreadSafeSingleton.TestGetTokenCount;
begin
  // Test getting the count of tokens in the singleton's Tokens list
  FSingleton.AddToken('foo');
  FSingleton.AddToken('bar');
  CheckEquals(2, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestContainsToken;
begin
  // Test checking if a token exists in the singleton's Tokens list using ContainsToken
  FSingleton.AddToken('foo');
  CheckTrue(FSingleton.ContainsToken('foo'));
  CheckFalse(FSingleton.ContainsToken('bar'));
end;

procedure TTestThreadSafeSingleton.TestAddDuplicateToken;
begin
  // Test adding a duplicate token to the singleton's Tokens list
  FSingleton.AddToken('foo');
  FSingleton.AddToken('foo');
  CheckEquals(1, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestRemoveNonExistentToken;
begin
  // Test removing a token that does not exist in the singleton's Tokens list
  FSingleton.AddToken('foo');
  FSingleton.RemoveToken('bar');
  CheckEquals(1, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestAddAndRemoveTokensConcurrentlyWithTasks;
var
  Task1, Task2: ITask;
begin
  // Test adding and removing tokens concurrently using two tasks
  Task1 := TTask.Create(
    procedure
    begin
      FSingleton.AddToken('foo');
    end
  );
  Task2 := TTask.Create(
    procedure
    begin
      FSingleton.RemoveToken('foo');
    end
  );
  Task1.Start;
  Task2.Start;
  TTask.WaitForAll([Task1, Task2]);
  CheckEquals(0, FSingleton.GetTokenCount);
end;


procedure TTestThreadSafeSingleton.TearDown;
begin
  FSingleton.Clear;
end;

procedure TTestThreadSafeSingleton.TestAddAndRemoveTokensConcurrentlyWithParallel;
begin
  // Test adding and removing tokens concurrently using one thread
  TParallel.For(1, 1000,
    procedure(I: Integer)
    begin
      FSingleton.AddToken(IntToStr(I));
      FSingleton.RemoveToken(IntToStr(I));
    end
  );
  CheckEquals(0, FSingleton.GetTokenCount);
end;

procedure TTestThreadSafeSingleton.TestAddAndRemoveTokensConcurrentlyWithThreads;
var
  Thread1, Thread2: TThread;
begin
  // Test adding and removing tokens concurrently using two threads
  Thread1 := TThread.CreateAnonymousThread(
    procedure
    begin
      FSingleton.AddToken('foo');
    end
  );
  Thread2 := TThread.CreateAnonymousThread(
    procedure
    begin
      FSingleton.RemoveToken('foo');
    end
  );
  Thread1.Start;
  Thread2.Start;
  Thread1.WaitFor;
  Thread2.WaitFor;
  CheckEquals(0, FSingleton.GetTokenCount);
end;

initialization
  // Register the test fixture
  RegisterTest(TTestThreadSafeSingleton.Suite);

end.

