class RequestMailerPreview < ActionMailer::Preview
  def request_email
    RequestMailer.request_email
  end
end
