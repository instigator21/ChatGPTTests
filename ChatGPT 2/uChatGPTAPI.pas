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
    var JsonObj := TJSONObject.Create()
        .AddPair(TJSONPair.Create('prompt', TextToProcess))
        .AddPair(TJSONPair.Create('max_tokens', TJSONNumber.Create(60)));
    try
      RequestContent := TStringStream.Create(JsonObj.ToString, TEncoding.UTF8);      

      try
        Request := TNetHTTPRequest.Create(nil);
        try
          Request.Client := HTTPClient;
          Request.MethodString := 'POST';
          Request.URL := 'https://api.openai.com/v1/engines/davinci-codex/completions';
          Request.SourceStream := RequestContent;
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
      JsonObj.Free;
    end;
  finally
    HTTPClient.Free;
  end;
end;

end.

