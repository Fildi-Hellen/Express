<!DOCTYPE html>
<html>
<head>
    <title>Business Verification</title>
</head>
<body>
    <p>Dear {{ $vendor->first_name }},</p>

    <p>Your business has been verified by our team. You can now log in to the vendor panel using the link below:</p>

    <p><a href="{{ url('/vendor/login') }}">Access Vendor Panel</a></p>

    <p>Best regards,<br>Expressud Team</p>
</body>
</html>
