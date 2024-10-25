document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', send_email); 

  // By default, load the inbox
  load_mailbox('inbox');
});

//needed to display the compose view
function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

//needed to display the submit the form
function send_email(event) {
  console.log("send_email function called");
  event.preventDefault(); // Prevent default form submission

  console.log("the form was submitted");
  
  //get the values from the form
  let email_recipients = event.target['compose-recipients'].value; //TODO allow for multiple recipients  
  let email_subject = event.target['compose-subject'].value;
  let email_body = event.target['compose-body'].value;

  console.log("recipients: " + email_recipients);
  console.log("subject: " + email_subject);
  console.log("body: " + email_body); 

  //POSTing to the /emails 
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: email_recipients,
        subject: email_subject,
        body: email_body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log("the result of composing an email", result);

      load_mailbox('sent'); //load the list of sent emails
  });

  //display the sent view
  load_mailbox('sent');
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
