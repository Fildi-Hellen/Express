// ===================================================
// EXPRESS MESSAGING SYSTEM - BROWSER SETUP HELPER
// ===================================================
// Run this script in your browser console to set up the messaging system

console.log('🚀 Setting up Express Messaging System...');

// Configuration
const config = {
    apiUrl: 'http://localhost:8000/api',
    driverPort: 4201,
    customerPort: 4200
};

// Utility functions
const setupAuth = async () => {
    console.log('🔐 Setting up authentication...');
    
    try {
        const response = await fetch(`${config.apiUrl}/test-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user_token', data.token);
            localStorage.setItem('driver_token', data.token);
            
            console.log('✅ Auth token set:', data.token);
            return data.token;
        } else {
            throw new Error('No token received');
        }
    } catch (error) {
        console.error('❌ Failed to setup auth:', error);
        // Fallback token for testing
        const fallbackToken = '1|test-token-for-development';
        localStorage.setItem('authToken', fallbackToken);
        console.log('🔧 Using fallback token:', fallbackToken);
        return fallbackToken;
    }
};

const createTestData = async (token) => {
    console.log('🧪 Creating test data...');
    
    try {
        const response = await fetch(`${config.apiUrl}/messaging/test-data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Test data created:', data.data);
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to create test data');
        }
    } catch (error) {
        console.error('❌ Failed to create test data:', error);
        return null;
    }
};

const setupDriverApp = (testData) => {
    console.log('🚗 Setting up driver app...');
    
    // Set driver-specific data
    const driverId = testData?.test_driver_id || 1;
    localStorage.setItem('driverId', driverId.toString());
    localStorage.setItem('isDriver', 'true');
    localStorage.setItem('currentCustomerId', '2'); // Default customer for testing
    
    console.log(`✅ Driver setup complete:
    - Driver ID: ${driverId}
    - URL: http://localhost:${config.driverPort}
    - Default Customer: 2`);
    
    return driverId;
};

const setupCustomerApp = (testData) => {
    console.log('👤 Setting up customer app...');
    
    // Set customer-specific data
    const customerId = testData?.test_customer_id || 2;
    localStorage.setItem('userId', customerId.toString());
    localStorage.setItem('isDriver', 'false');
    localStorage.setItem('currentDriverId', '1'); // Default driver for testing
    
    console.log(`✅ Customer setup complete:
    - Customer ID: ${customerId}
    - URL: http://localhost:${config.customerPort}
    - Default Driver: 1`);
    
    return customerId;
};

const testMessaging = async (token) => {
    console.log('📨 Testing messaging functionality...');
    
    try {
        // Test sending a message
        const messageResponse = await fetch(`${config.apiUrl}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient_id: 2,
                content: 'Test message from setup script',
                sender_type: 'driver'
            })
        });
        
        const messageData = await messageResponse.json();
        
        if (messageData.success) {
            console.log('✅ Message sending test passed');
        } else {
            console.warn('⚠️ Message sending test failed:', messageData.message);
        }
        
        // Test getting conversation
        const conversationResponse = await fetch(`${config.apiUrl}/driver/conversations/2`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const conversationData = await conversationResponse.json();
        
        if (conversationData.success) {
            console.log('✅ Conversation retrieval test passed');
            console.log(`📋 Found ${conversationData.data.length} messages`);
        } else {
            console.warn('⚠️ Conversation retrieval test failed:', conversationData.message);
        }
        
    } catch (error) {
        console.error('❌ Messaging test failed:', error);
    }
};

const detectCurrentApp = () => {
    const port = window.location.port;
    const hostname = window.location.hostname;
    
    if (port === config.driverPort.toString()) {
        return 'driver';
    } else if (port === config.customerPort.toString()) {
        return 'customer';
    } else {
        return 'unknown';
    }
};

const showInstructions = (appType, driverId, customerId) => {
    console.log(`
🎯 SETUP COMPLETE! Here's what to do next:

${appType === 'driver' ? '🚗 DRIVER APP DETECTED' : appType === 'customer' ? '👤 CUSTOMER APP DETECTED' : '❓ UNKNOWN APP'}

📋 TESTING STEPS:
${appType === 'driver' ? `
1. 🔄 Refresh the page
2. 📱 Navigate to messaging section
3. 👤 Select Customer ID: ${customerId}
4. 💬 Start sending messages
5. 📞 Test call functionality
` : appType === 'customer' ? `
1. 🔄 Refresh the page  
2. 📱 Navigate to messaging section
3. 🚗 Chat with Driver ID: ${driverId}
4. 💬 Start sending messages
5. 📞 Test call functionality
` : `
1. Open driver app: http://localhost:${config.driverPort}
2. Open customer app: http://localhost:${config.customerPort}
3. Run this script in both browser consoles
4. Test messaging between apps
`}

🔧 TROUBLESHOOTING:
- If messages don't appear, check browser console for errors
- Use "Create Test Data" button in the UI for more sample messages
- Check that backend server is running on http://localhost:8000
- Verify localStorage has the auth token set

💾 CURRENT STORAGE:
- Auth Token: ${localStorage.getItem('authToken') ? '✅ Set' : '❌ Missing'}
- Driver ID: ${localStorage.getItem('driverId') || 'Not set'}
- Customer ID: ${localStorage.getItem('userId') || 'Not set'}

Happy testing! 🎉
    `);
};

// Main setup function
const runSetup = async () => {
    console.log('🚀 Starting Express Messaging System setup...');
    
    const appType = detectCurrentApp();
    console.log(`📱 Detected app type: ${appType}`);
    
    try {
        // Setup authentication
        const token = await setupAuth();
        
        // Create test data
        const testData = await createTestData(token);
        
        // Setup app-specific data
        const driverId = setupDriverApp(testData);
        const customerId = setupCustomerApp(testData);
        
        // Test messaging functionality
        await testMessaging(token);
        
        // Show final instructions
        showInstructions(appType, driverId, customerId);
        
        console.log('🎉 Setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
        console.log('🔧 Manual setup may be required. Check the setup guide.');
    }
};

// Run the setup
runSetup();

// Expose utility functions for manual testing
window.expressMessagingHelper = {
    setupAuth,
    createTestData,
    testMessaging,
    config,
    detectCurrentApp: () => detectCurrentApp()
};

console.log('💡 Helper functions available at: window.expressMessagingHelper');
