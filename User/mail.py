from django.core.mail import send_mail
import threading
   




def get_html_formated(name,temp_pass):
    return f"""
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family:Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="500" 
                 style="background-color:#64648f; border-radius:12px; border:1px solid #c6c6c6; box-shadow:1px 5px 12px -4px rgba(255,255,255,0.79);">
            
            <tr>
              <td align="left" style="padding: 20px; color: #f0ffff; font-size: 24px; font-weight: bold;">
                Welcome to the team {name}
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 20px; color:#f8f8f8; font-size:18px;">
                Temporary login password :
                <a
                  href="http://127.0.0.1:8000/yasier"
                  target="_blank"
                  style="color: white"
                  >Login</a
                >
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px;">
                <div style="font-size:28px; font-weight:800; letter-spacing:4px; border:2px dashed #f9eaf9; display:inline-block; padding:10px 20px; background:#ffffff; color:#000000;">
                  {temp_pass}
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

"""

def async_mail(email,subject="",message="",html=""):
    def mail_task():
        send_mail(
        subject,
        message,
        "jakirmahi20009@gmail.com",  
        [email],        
        fail_silently=False,
        html_message= html
        )
    threading.Thread(target=mail_task).start()

def new_user_mail(email,name,temp_pass):
    async_mail(email,subject="New account created",message="",html=get_html_formated(name,temp_pass))