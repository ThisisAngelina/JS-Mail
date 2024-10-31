document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //process the email when the form is submitted
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
  event.preventDefault(); // Prevent default form submission
  //get the values from the form
  let email_recipients = event.target['compose-recipients'].value; //no need to separate the recipients - this is done in the views.py  
  let email_subject = event.target['compose-subject'].value;
  let email_body = event.target['compose-body'].value;

  //handling of the empty recipient fieldand the case of empty email body is done in the views.py 
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

}

//function to display received, sent, and archived emails

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear what was previously displayed in the mailbox
  document.querySelector('#emails-view').innerHTML = "";

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => { //a concise for loop in JS
      
      //create an email DIV
      let emailDiv = document.createElement('div');
      emailDiv.className = 'emailDiv';
      emailDiv.style.backgroundColor = email.read ? 'lightgrey' : 'white'; //inline conditional in Javascript: //condition ? iftrue : iffalse//
      emailDiv.style.border = '1px solid grey';
      emailDiv.style.padding = '10px';
      emailDiv.style.marginBottom = '10px';

      //create and populate a sender span inside the email DIV
      let senderSpan = document.createElement('span');
      senderSpan.className = "sender"; //we are using class names and not ID names here because IDs are unique, but classes can refer to multiple objects
      senderSpan.textContent = email.sender; //we can use the textContent property instead of the innerHTML property if we are dealing with plain text.The textContent property ignores HTML tags
      senderSpan.style.fontWeight = 'bold';

      //create and populate a subject span inside the email DIV
      let subjectSpan = document.createElement('span');
      subjectSpan.className = "subject";
      subjectSpan.textContent = email.subject;
      subjectSpan.style.marginLeft = '10px';

      //create and populate a timestamp span inside the email DIV
      let timestampSpan = document.createElement('span');
      timestampSpan.className = "timestamp";
      timestampSpan.textContent = email.timestamp;
      timestampSpan.style.float = 'right'; //anchor the timestamp to the right
      
      //append the spans to the div and the div to the emails view

      document.querySelector('#emails-view').appendChild(emailDiv);

      emailDiv.appendChild(senderSpan);
      emailDiv.appendChild(subjectSpan);
      emailDiv.appendChild(timestampSpan);


    });
  });

}

