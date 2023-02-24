unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls;

type
  TForm1 = class(TForm)
    btn1: TButton;
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
  System.JSON;

{$R *.dfm}

procedure TForm1.btn1Click(Sender: TObject);
var
  Str: string;
  JSONArray: TJSONArray;
begin
  Str := '[1, 2, 3, 4]';
  JSONArray := TJSONObject.ParseJSONValue(Str) as TJSONArray;
  if Assigned(JSONArray) then
  begin
    try
      // do something with JSONArray
    finally
      JSONArray.Free;
    end;
  end;
end;

end.
