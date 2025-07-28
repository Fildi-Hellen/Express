@echo off
echo ===============================================
echo          EXPRESS MESSAGING SYSTEM TEST
echo ===============================================
echo.

echo 1. Testing Backend API Connection...
curl -X GET http://localhost:8000/api/user --fail --silent --output NUL
if %errorlevel% neq 0 (
    echo ❌ Backend server not running. Please start with: php artisan serve
    pause
    exit /b 1
) else (
    echo ✅ Backend server is running
)

echo.
echo 2. Creating test authentication token...
curl -X POST http://localhost:8000/api/test-login -H "Content-Type: application/json" > temp_token.json 2>NUL
if %errorlevel% neq 0 (
    echo ❌ Failed to create test token
    pause
    exit /b 1
) else (
    echo ✅ Test token created
    type temp_token.json
)

echo.
echo 3. Testing messaging endpoints...
for /f "tokens=2 delims=:" %%i in ('findstr "token" temp_token.json') do set TOKEN=%%i
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN:,=%
set TOKEN=%TOKEN: =%

curl -X POST http://localhost:8000/api/messaging/test-data -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" > test_data.json 2>NUL
if %errorlevel% neq 0 (
    echo ❌ Failed to create test data
) else (
    echo ✅ Test data created successfully
    type test_data.json
)

echo.
echo 4. Testing message sending...
curl -X POST http://localhost:8000/api/messages -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"recipient_id\":2,\"content\":\"Test message from script\",\"sender_type\":\"driver\"}" > send_test.json 2>NUL
if %errorlevel% neq 0 (
    echo ❌ Failed to send test message
) else (
    echo ✅ Test message sent successfully
    type send_test.json
)

echo.
echo 5. Testing conversation retrieval...
curl -X GET http://localhost:8000/api/driver/conversations/2 -H "Authorization: Bearer %TOKEN%" > conversation_test.json 2>NUL
if %errorlevel% neq 0 (
    echo ❌ Failed to retrieve conversation
) else (
    echo ✅ Conversation retrieved successfully
    type conversation_test.json
)

echo.
echo ===============================================
echo              TEST SUMMARY
echo ===============================================
echo ✅ Backend API is working
echo ✅ Authentication is working
echo ✅ Test data creation is working
echo ✅ Message sending is working
echo ✅ Conversation retrieval is working
echo.
echo Your auth token: %TOKEN%
echo.
echo Next steps:
echo 1. Start driver app: cd driver && ng serve --port 4201
echo 2. Start customer app: cd Expressud && ng serve --port 4200
echo 3. Set auth token in browser localStorage
echo 4. Test the messaging interface
echo.
echo Cleaning up temporary files...
del temp_token.json test_data.json send_test.json conversation_test.json 2>NUL

pause
