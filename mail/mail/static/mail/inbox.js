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


//compose an email - not from scratch, but as a reply to a received email
function reply(sender, subject, timestamp, body){
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelectorAll('.detailedDiv').forEach((element) => {
    element.style.display = 'none';
});

document.querySelector('#compose-recipients').value = sender;
document.querySelector('#compose-subject').value = 'Re: ' + subject;
document.querySelector('#compose-body').value = 'On ' + timestamp + ', ' + sender + ' wrote: ' + body;

}


//needed to display the submit the form
function send_email(event) {
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
  document.querySelectorAll('.detailedDiv').forEach((element) => {
      element.style.display = 'none';
  });

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

      //add an event listener to the email for the view_email function

      emailDiv.addEventListener('click', () => view_email(email.id));


    });
  });

}


//view a particualar email's content
//the function is called within the laod_mailbox function
function view_email(email_id){
  
  //hide all the unneeded divs
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
   
  //create a new div for the detailed email view
  let detailedDiv = document.createElement('div');
  detailedDiv.className = 'detailedDiv';
  detailedDiv.style.border = '1px solid grey';
  detailedDiv.style.padding = '10px';
  document.body.appendChild(detailedDiv);
     
  //create the "from" <p> with two inline <span>s
  let fromLine = document.createElement('p');
  
  detailedDiv.appendChild(fromLine);
   
  let fromSpanTitle = document.createElement('span');
  fromSpanTitle.textContent = 'From: ';
  fromSpanTitle.style.fontWeight = 'bold';
  fromLine.appendChild(fromSpanTitle);

  let fromSpanContent = document.createElement('span');
  fromLine.appendChild(fromSpanContent);

   //create the "tp" <p> with two inline <span>s
   let toLine = document.createElement('p');
   detailedDiv.appendChild(toLine);
    
   let toSpanTitle = document.createElement('span');
   toSpanTitle.textContent = 'To: ';
   toSpanTitle.style.fontWeight = 'bold';
   toLine.appendChild(toSpanTitle);
 
   let toSpanContent = document.createElement('span');
   toLine.appendChild(toSpanContent);

   //create the "subject" <p> with two inline <span>s
   let subjectLine = document.createElement('p');
   detailedDiv.appendChild(subjectLine);
    
   let subjectSpanTitle = document.createElement('span');
    subjectSpanTitle.textContent = 'Subject: ';
    subjectSpanTitle.style.fontWeight = 'bold';
    subjectLine.appendChild(subjectSpanTitle);
 
   let subjectSpanContent = document.createElement('span');
   subjectLine.appendChild(subjectSpanContent);

    //create the "timestamp" <p> with two inline <span>s
   let timestampLine = document.createElement('p');
   detailedDiv.appendChild(timestampLine);
     
    let timestampSpanTitle = document.createElement('span');
     timestampSpanTitle.textContent = 'Timestamp: ';
     timestampSpanTitle.style.fontWeight = 'bold';
     timestampLine.appendChild(timestampSpanTitle);
  
    let timestampSpanContent = document.createElement('span');
    timestampLine.appendChild(timestampSpanContent);

    //create the reply button //TODO attach fucntionality to the button
    let replyButton = document.createElement('button');
    detailedDiv.appendChild(replyButton);

    //create the email content field

    var bodyLine = document.createElement('p');
    replyButton.textContent = 'Reply';
    replyButton.classList.add('btn', 'btn-primary', 'mb-3'); //adding the Bootstrap style class to the button
    detailedDiv.appendChild(bodyLine);
    
    //fetch the email

    fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
    // populate the span elements with the email content

      var email_sender = email.sender
      fromSpanContent.textContent = email_sender;
      toSpanContent.textContent = email.recipients;
      subjectSpanContent.textContent = email.subject;
      timestampSpanContent.textContent = email.timestamp;
      bodyLine.textContent = email.body;

      //asign the onlclick function to the reply button after the email has been fetched
      replyButton.onclick = () => reply(email.sender, email.subject, email.timestamp, email.body);
    

      //create the archive / unarchive button and execute the archiving/unarchiving

    //check that we are NOT in the Sent mailbox
    if (email_sender != document.querySelector('#authenticated_user').innerHTML){
      // create the button
      let archiveButton = document.createElement('button');
      archiveButton.classList.add('btn', 'btn-secondary', 'mb-3'); 
      detailedDiv.appendChild(archiveButton);

      // check whether we are viewing an archived or an unarchived email
      if (email.archived == true){
        archiveButton.textContent = "Unarchive";
        archiveButton.onclick = function(){
          fetch(`/emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: false
            })
          });
          load_mailbox('inbox'); //redirect to the inbox view

        };

      }
      else {
        archiveButton.textContent = "Archive";
        archiveButton.onclick = function(){
          fetch(`/emails/${email_id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: true
            })
          });
          load_mailbox('inbox'); //redirect to the inbox view

        };
      }
    }

});


  //mark the email as read - send a PUT request to the relative views route 
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })



}


