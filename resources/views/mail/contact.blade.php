<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>New Contact Message</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Base Styles */
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
        }
        
        /* Container Styles */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        /* Header Styles */
        .email-header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .email-header h1 {
            margin: 0;
            font-weight: 600;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .email-header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }
        
        /* Body Styles */
        .email-body {
            padding: 30px;
        }
        
        /* Card Styles */
        .info-card {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #2575fc;
        }
        
        .message-card {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        /* Info Item Styles */
        .info-item {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .info-icon {
            width: 40px;
            height: 40px;
            background-color: #2575fc;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .info-content {
            flex-grow: 1;
        }
        
        .info-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            color: #212529;
            font-size: 16px;
        }
        
        /* Message Styles */
        .message-title {
            font-weight: 600;
            color: #495057;
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
        }
        
        .message-content {
            background-color: white;
            border-radius: 6px;
            padding: 15px;
            border: 1px solid #e9ecef;
            min-height: 100px;
            white-space: pre-wrap;
        }
        
        /* Footer Styles */
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        
        /* Button Styles */
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 117, 252, 0.3);
        }
        
        /* Responsive Styles */
        @media (max-width: 576px) {
            .email-container {
                border-radius: 0;
            }
            
            .info-item {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .info-icon {
                margin-right: 0;
                margin-bottom: 10px;
            }
        }
    </style>
</head>

<body>
    <!-- Get footer info from database -->
    @php
        $footerInfo = \App\Models\FooterInfo::select('copyright')->first();
    @endphp
    
    <!-- Email Container -->
    <div class="email-container">
        <!-- Email Header -->
        <div class="email-header">
            <h1>
                <!-- Inline SVG for envelope icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                    <path d="M3 8L10.89 13.26C11.5034 13.6691 12.2267 13.8871 12.9667 13.8871C13.7066 13.8871 14.4299 13.6691 15.0433 13.26L23 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                New Contact Message
            </h1>
            <p>You've received a new message from your website {{ $settings->site_name ?? 'Your Website' }} contact form</p>
        </div>
        
        <!-- Email Body -->
        <div class="email-body">
            <!-- Contact Information Card -->
            <div class="info-card">
                <!-- Name -->
                <div class="info-item">
                    <div class="info-icon">
                        <!-- Inline SVG for user icon -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Name</div>
                        <div class="info-value">{{ $data['first_name'] ?? '' }} {{ $data['last_name'] ?? '' }}</div>
                    </div>
                </div>
                
                <!-- Email -->
                <div class="info-item">
                    <div class="info-icon">
                        <!-- Inline SVG for email icon -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">{{ $data['email'] ?? '' }}</div>
                    </div>
                </div>
                
                <!-- Phone -->
                <div class="info-item">
                    <div class="info-icon">
                        <!-- Inline SVG for phone icon -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 16.92V19.92C22 20.4687 21.7825 20.9948 21.3976 21.3796C21.0128 21.7645 20.4867 21.982 19.938 21.982H19.92C15.6491 21.708 11.5765 20.074 8.27 17.27C5.19139 14.2117 2.97522 10.2848 1.92 5.98C1.81875 5.43887 1.90435 4.878 2.16206 4.39182C2.41977 3.90564 2.83439 3.52257 3.34 3.304L6.34 2.064C6.84443 1.8489 7.40804 1.82249 7.93012 1.98945C8.4522 2.15641 8.89857 2.50561 9.19 2.974L10.69 5.474C10.9397 5.88076 11.0486 6.35688 11.0006 6.83011C10.9526 7.30334 10.75 7.74867 10.424 8.094L9.05 9.544C10.0464 11.4125 11.5875 12.9536 13.456 13.95L14.906 12.576C15.2513 12.25 15.6967 12.0474 16.1699 11.9994C16.6431 11.9514 17.1192 12.0603 17.526 12.31L20.026 13.81C20.4944 14.1014 20.8436 14.5478 21.0105 15.0699C21.1775 15.592 21.1511 16.1556 20.936 16.66L22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Phone Number</div>
                        <div class="info-value">{{ $data['phone'] ?? '' }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Message Card -->
            <div class="message-card">
                <div class="message-title">
                    <!-- Inline SVG for message icon -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Message
                </div>
                <div class="message-content">
                    {{ $data['message'] ?? '' }}
                </div>
            </div>
            
            <!-- Action Button -->
            <div class="text-center">
                <a href="mailto:{{ $data['email'] ?? '' }}" class="action-button">
                    <!-- Inline SVG for reply icon -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                        <path d="M10 13L5 18M5 18V13M5 18H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11L19 6M19 6V11M19 6H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Reply to Sender
                </a>
            </div>
        </div>
        
        <!-- Email Footer -->
        <div class="email-footer">
            <p>This message was sent from your website contact form on {{ date('F j, Y, g:i a') }}</p>
            <p>{{ $footerInfo->copyright ?? '&copy; ' . date('Y') . ' Your Company. All rights reserved.' }}</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>