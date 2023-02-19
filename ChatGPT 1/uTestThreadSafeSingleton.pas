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
  published
    procedure TestGetInstance;
    procedure TestAddToken;
    procedure TestRemoveToken;
  end;

implementation

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

initialization
  // Register the test fixture
  RegisterTest(TTestThreadSafeSingleton.Suite);

end.

