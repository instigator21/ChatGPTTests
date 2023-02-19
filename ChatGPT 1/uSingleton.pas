unit uSingleton;

interface

uses
  Classes, SyncObjs;

type
  // Singleton class with thread-safe implementation
  TMySingleton = class
  private
    class var FInstance: TMySingleton;
    class var FLock: TCriticalSection;
    FTokens: TStringList;

    constructor Create;
    destructor Destroy; override;

    function GetTokens: TStrings;

  public
    // Returns the single instance of the class, creating it if necessary
    class function GetInstance: TMySingleton;

    // Adds a word to the Tokens array
    procedure AddToken(const AToken: string);

    // Removes a word from the Tokens array
    procedure RemoveToken(const AToken: string);

    // Returns a copy of the Tokens array
    function GetTokensCopy: TStrings;

    property Tokens: TStrings read GetTokens;
  end;

implementation

{ TMySingleton }

constructor TMySingleton.Create;
begin
  inherited;
  FTokens := TStringList.Create;
end;

destructor TMySingleton.Destroy;
begin
  FTokens.Free;
  inherited;
end;

function TMySingleton.GetTokens: TStrings;
begin
  FLock.Enter;
  try
    Result := FTokens;
  finally
    FLock.Leave;
  end;
end;

function TMySingleton.GetTokensCopy: TStrings;
begin
  FLock.Enter;
  try
    Result := TStringList.Create;
    Result.Assign(FTokens);
  finally
    FLock.Leave;
  end;
end;

class function TMySingleton.GetInstance: TMySingleton;
begin
  if FInstance = nil then
  begin
    FLock.Enter;
    try
      if FInstance = nil then
        FInstance := TMySingleton.Create;
    finally
      FLock.Leave;
    end;
  end;
  Result := FInstance;
end;

procedure TMySingleton.AddToken(const AToken: string);
begin
  FLock.Enter;
  try
    FTokens.Add(AToken);
  finally
    FLock.Leave;
  end;
end;

procedure TMySingleton.RemoveToken(const AToken: string);
begin
  FLock.Enter;
  try
    FTokens.Delete(FTokens.IndexOf(AToken));
  finally
    FLock.Leave;
  end;
end;

initialization
  TMySingleton.FLock := TCriticalSection.Create;

finalization
  TMySingleton.FLock.Free;

end.

