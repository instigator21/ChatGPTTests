object Form1: TForm1
  Left = 0
  Top = 0
  Caption = 'Form1'
  ClientHeight = 604
  ClientWidth = 635
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  PixelsPerInch = 96
  TextHeight = 13
  object btn1: TButton
    Left = 0
    Top = 579
    Width = 635
    Height = 25
    Align = alBottom
    Caption = 'btn1'
    TabOrder = 0
    OnClick = btn1Click
    ExplicitLeft = 272
    ExplicitTop = 256
    ExplicitWidth = 75
  end
  object mmoIn: TMemo
    Left = 0
    Top = 0
    Width = 635
    Height = 89
    Align = alTop
    Lines.Strings = (
      'mmoIn')
    TabOrder = 1
    ExplicitLeft = 32
    ExplicitTop = 24
    ExplicitWidth = 185
  end
  object mmoOut: TMemo
    Left = 0
    Top = 89
    Width = 635
    Height = 490
    Align = alClient
    Lines.Strings = (
      'mmoOut')
    TabOrder = 2
    ExplicitLeft = 216
    ExplicitTop = 240
    ExplicitWidth = 185
    ExplicitHeight = 89
  end
end
