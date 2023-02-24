unit uChatGPTAPI;

interface

uses
  System.SysUtils, System.Classes, System.JSON, System.Net.URLClient, System.Net.HttpClient,
  System.Net.HttpClientComponent;

type
  TChatGPT = class
  public
    class function GenerateText(const APIKey, TextToProcess: string): string;
  end;

implementation

{ TChatGPT }

class function TChatGPT.GenerateText(const APIKey, TextToProcess: string): string;
var
  HTTPClient: TNetHTTPClient;
  RequestContent: TStream;
  Request: TNetHTTPRequest;
  ResponseContent: string;
  ResponseJSON: TJSONObject;
  ChoiceObject: TJSONObject;
  GeneratedText: TJSONString;
begin
  HTTPClient := TNetHTTPClient.Create(nil);
  try
    var JsonObj1 := TJSONObject.Create(TJSONPair.Create('prompt', TextToProcess));
    JsonObj1.AddPair(TJSONPair.Create('max_tokens', '60'));

    RequestContent := TStringStream.Create(JsonObj1.ToString, TEncoding.UTF8);

    try
      Request := TNetHTTPRequest.Create(nil);
      try
        Request.MethodString := 'POST';
        Request.URL := 'https://api.openai.com/v1/engines/davinci-codex/completions';
        Request.ContentStream := RequestContent;
        Request.CustomHeaders['Content-Type'] := 'application/json';
        Request.CustomHeaders['Authorization'] := Format('Bearer %s', [APIKey]);
        ResponseContent := Request.Execute().ContentAsString();
        ResponseJSON := TJSONObject.ParseJSONValue(ResponseContent) as TJSONObject;
        try
          ChoiceObject := (ResponseJSON.Get('choices').JsonValue as TJSONArray).Items[0] as TJSONObject;
          GeneratedText := ChoiceObject.GetValue('text') as TJSONString;
          Result := GeneratedText.Value;
        finally
          ResponseJSON.Free;
        end;
      finally
        Request.Free;
      end;
    finally
      RequestContent.Free;
    end;
  finally
    HTTPClient.Free;
  end;
end;

end.

