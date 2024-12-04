<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
</head>
<body>
    <h2>New Order Confirmation</h2>
    <p><strong>Recipient Name:</strong> {{ $recipient_name }}</p>
    <p><strong>Phone:</strong> {{ $recipient_phone }}</p>
    <p><strong>Address:</strong> {{ $recipient_address }}</p>
    <p><strong>Payment Method:</strong> {{ $payment_method }}</p>
    <p><strong>Amount:</strong> {{ isset($amount) ? '$' . $amount : 'N/A' }}</p>
</body>
</html>
