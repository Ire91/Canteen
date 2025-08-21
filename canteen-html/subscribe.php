<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = $_POST['email'] ?? '';
    
    // Validate email
    if (empty($email)) {
        $error = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format";
    } else {
        // In a real application, you would add the email to a database or newsletter service
        // For now, we'll just return a success message
        
        // Redirect back to the home page with a success message
        header("Location: index.html?newsletter=success");
        exit;
    }
    
    // If there's an error, redirect back with the error message
    if (isset($error)) {
        header("Location: index.html?newsletter=error&message=" . urlencode($error));
        exit;
    }
} else {
    // If the form was not submitted, redirect to the home page
    header("Location: index.html");
    exit;
}
?>
