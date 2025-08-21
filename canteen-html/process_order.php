<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $department = $_POST['department'] ?? '';
    $deliveryOption = $_POST['deliveryOption'] ?? '';
    $officeLocation = $_POST['officeLocation'] ?? '';
    $deliveryTime = $_POST['deliveryTime'] ?? '';
    $notes = $_POST['notes'] ?? '';
    $paymentMethod = $_POST['paymentMethod'] ?? '';
    $orderItems = $_POST['orderItems'] ?? '[]';
    $subtotal = $_POST['subtotal'] ?? '0';
    $deliveryFee = $_POST['deliveryFee'] ?? '0';
    $total = $_POST['total'] ?? '0';
    
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
    
    if (empty($phone)) {
        $errors[] = "Phone number is required";
    }
    
    if (empty($department)) {
        $errors[] = "Department is required";
    }
    
    if (empty($deliveryOption)) {
        $errors[] = "Delivery option is required";
    }
    
    if ($deliveryOption === 'delivery' && empty($officeLocation)) {
        $errors[] = "Office location is required for delivery";
    }
    
    if (empty($deliveryTime)) {
        $errors[] = "Delivery/pickup time is required";
    }
    
    if (empty($paymentMethod)) {
        $errors[] = "Payment method is required";
    }
    
    // If there are no errors, process the order
    if (empty($errors)) {
        // Generate order number
        $orderNumber = 'UBC-' . date('Ymd') . '-' . rand(1000, 9999);
        
        // In a real application, you would store the order in a database
        // For now, we'll just return a success message with the order number
        
        // Create response data
        $response = [
            'success' => true,
            'orderNumber' => $orderNumber,
            'message' => 'Your order has been placed successfully!'
        ];
        
        // Return JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
    // If there are errors, return error message
    $response = [
        'success' => false,
        'errors' => $errors
    ];
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    // If the form was not submitted, redirect to the checkout page
    header("Location: checkout.html");
    exit;
}
?>
