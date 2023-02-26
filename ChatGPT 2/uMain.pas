unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls;

type
  TForm1 = class(TForm)
    btn1: TButton;
    mmoIn: TMemo;
    mmoOut: TMemo;
    procedure btn1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

uses
  uChatGPTAPI;

{$R *.dfm}

procedure TForm1.btn1Click(Sender: TObject);
const
  cAPIKey = '';
begin
  mmoOut.Text := TChatGPT.GenerateText(cAPIKey, mmoIn.Text);
end;

end.
