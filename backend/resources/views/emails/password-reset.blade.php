<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <p>Dear {{ $vendor->first_name }},</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="{{ $url }}">Reset Password</a></p>
    <p>If you did not request a password reset, no further action is required.</p>
    <p>Regards,<br>Expressud Team</p>
</body>
</html>
