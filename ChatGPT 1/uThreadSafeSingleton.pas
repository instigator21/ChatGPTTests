unit uThreadSafeSingleton;

interface

uses
  System.SysUtils, System.Classes, System.Generics.Collections, System.SyncObjs;

type
  TThreadSafeSingleton = class
  strict private
    class var FInstance: TThreadSafeSingleton;
    class var FLock: TCriticalSection;
    FTokens: TStringList;
    function GetTokens: TStringList;
  private
    constructor Create;
  public
    class function Instance: TThreadSafeSingleton;
    class property Lock: TCriticalSection Read Flock write Flock;
    destructor Destroy; override;
    procedure AddToken(const AToken: string);
    procedure RemoveToken(const AToken: string);
    function TokenExists(const AToken: string): Boolean;
    function GetTokenCount: Integer;
    function ContainsToken(const Token: string): Boolean;
    procedure Clear;
  end;

implementation

{ TThreadSafeSingleton }

constructor TThreadSafeSingleton.Create;
begin
  FTokens := TStringList.Create;
end;

destructor TThreadSafeSingleton.Destroy;
begin
  FTokens.Free;
  inherited;
end;

function TThreadSafeSingleton.GetTokens: TStringList;
begin
  TMonitor.Enter(FLock);
  try
    Result := FTokens;
  finally
    TMonitor.Exit(FLock);
  end;
end;

class function TThreadSafeSingleton.Instance: TThreadSafeSingleton;
begin
  if not Assigned(FInstance) then
  begin
    TMonitor.Enter(FLock);
    try
      if not Assigned(FInstance) then
        FInstance := TThreadSafeSingleton.Create;
    finally
      TMonitor.Exit(FLock);
    end;
  end;
  Result := FInstance;
end;

procedure TThreadSafeSingleton.AddToken(const AToken: string);
begin
  TMonitor.Enter(FLock);
  try
    if not self.ContainsToken(AToken) then
      FTokens.Add(AToken);
  finally
    TMonitor.Exit(FLock);
  end;
end;

procedure TThreadSafeSingleton.RemoveToken(const AToken: string);
begin
  if TokenExists(AToken) then
  begin
    TMonitor.Enter(FTokens);
    try
      var IndexOfToken := FTokens.IndexOf(AToken);
      FTokens.Delete(IndexOfToken);
    finally
      TMonitor.Exit(FTokens);
    end;
  end;
end;

function TThreadSafeSingleton.TokenExists(const AToken: string): Boolean;
begin
  TMonitor.Enter(FLock);
  try
    Result := Self.ContainsToken(AToken);
  finally
    TMonitor.Exit(FLock);
  end;
end;

function TThreadSafeSingleton.GetTokenCount: Integer;
begin
  TMonitor.Enter(FLock);
  try
    Result := FTokens.Count;
  finally
    TMonitor.Exit(FLock);
  end;
end;

procedure TThreadSafeSingleton.Clear;
begin
  TMonitor.Enter(FLock);
  try
    FTokens.Clear;
  finally
    TMonitor.Exit(FLock);
  end;
end;

function TThreadSafeSingleton.ContainsToken(const Token: string): Boolean;
begin
  FLock.Enter;
  try
    Result := FTokens.IndexOf(Token) >= 0;
  finally
    FLock.Leave;
  end;
end;


initialization
  TThreadSafeSingleton.Lock := TCriticalSection.Create;

finalization
  TThreadSafeSingleton.Lock.Free;
  TThreadSafeSingleton.Instance.Free;

end.

