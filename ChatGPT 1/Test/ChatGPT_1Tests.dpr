program ChatGPT_1Tests;
{

  Delphi DUnit Test Project
  -------------------------
  This project contains the DUnit test framework and the GUI/Console test runners.
  Add "CONSOLE_TESTRUNNER" to the conditional defines entry in the project options
  to use the console test runner.  Otherwise the GUI test runner will be used by
  default.

}

{$IFDEF CONSOLE_TESTRUNNER}
{$APPTYPE CONSOLE}
{$ENDIF}

uses
//  FastMM4,
  DUnitTestRunner,
  TestuThreadSafeSingleton in 'TestuThreadSafeSingleton.pas',
  uThreadSafeSingleton in '..\uThreadSafeSingleton.pas',
  uTestThreadSafeSingleton in '..\uTestThreadSafeSingleton.pas';

{$R *.RES}

begin
  ReportMemoryLeaksOnShutdown := True;
  DUnitTestRunner.RunRegisteredTests;
end.

