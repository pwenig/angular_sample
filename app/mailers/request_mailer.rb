class RequestMailer < ApplicationMailer
  def request_email(recipient, sender, request)
    mail(to: recipient,
         subject: 'Naming Convention Value Request',
         from: sender) do |format|
      format.html do
        render locals: { request: request }
      end
      format.text do
        render locals: { request: request }
      end
    end
  end
end
