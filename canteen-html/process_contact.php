<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Validate inputs
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If there are no errors, process the form
    if (empty($errors)) {
        // In a real application, you would send an email or store the message in a database
        // For now, we'll just return a success message
        
        // Email headers
        $headers = "From: $name <$email>" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        $headers .= "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
        
        // Email content
        $emailContent = "
            <html>
            <head>
                <title>$subject</title>
            </head>
            <body>
                <h2>Contact Form Submission</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Subject:</strong> $subject</p>
                <p><strong>Message:</strong></p>
                <p>" . nl2br($message) . "</p>
            </body>
            </html>
        ";
        
        // Recipient email (replace with your email)
        $to = "canteen@unionbank.com";
        
        // Send email (commented out for now)
        // $mailSent = mail($to, $subject, $emailContent, $headers);
        
        // For demonstration purposes, we'll just pretend the email was sent successfully
        $mailSent = true;
        
        if ($mailSent) {
            // Redirect back to the contact page with a success message
            header("Location: index.html#contact?status=success");
            exit;
        } else {
            $errors[] = "Failed to send email. Please try again later.";
        }
    }
    
    // If there are errors, redirect back to the contact page with error messages
    if (!empty($errors)) {
        $errorString = implode(", ", $errors);
        header("Location: index.html#contact?status=error&message=" . urlencode($errorString));
        exit;
    }
} else {
    // If the form was not submitted, redirect to the contact page
    header("Location: index.html#contact");
    exit;
}
?>
