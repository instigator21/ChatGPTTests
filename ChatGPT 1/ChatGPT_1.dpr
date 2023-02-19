program ChatGPT_1;

uses
  Vcl.Forms,
  uMain in 'uMain.pas' {Form1},
  uThreadSafeSingleton in 'uThreadSafeSingleton.pas',
  uTestThreadSafeSingleton in 'uTestThreadSafeSingleton.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
