program ChatGPT_2;

uses
  Vcl.Forms,
  uMain in 'uMain.pas' {Form1},
  uChatGPTAPI in 'uChatGPTAPI.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
