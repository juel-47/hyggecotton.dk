<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify OTP - {{ $settings?->site_name ?? 'Hygge Cotton' }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-red: #e65237;
            --color-yellow: #ffdd55;
            --color-dark-bg: #1a1915;
            --color-dark-card: #28261e;
            --color-cream: #fffbed;
            --color-gray: #ded8c6;
            --glass-bg: rgba(40, 38, 30, 0.8);
            --glass-border: rgba(255, 251, 237, 0.1);
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--color-dark-bg);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(230, 82, 55, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(255, 221, 85, 0.03) 0%, transparent 40%);
            color: var(--color-cream);
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .login-card {
            width: 100%;
            max-width: 440px;
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            margin: 1.5rem;
            border: 1px solid var(--glass-border);
            position: relative;
            overflow: hidden;
        }

        .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--color-red), transparent);
            animation: border-flow 3s infinite linear;
        }

        @keyframes border-flow {
            to { left: 100%; }
        }

        .header-section {
            text-align: center;
            margin-bottom: 2.75rem;
        }

        .header-section i {
            font-size: 3.5rem;
            color: var(--color-red);
            margin-bottom: 1.5rem;
            filter: drop-shadow(0 8px 16px rgba(230, 82, 55, 0.3));
        }

        .header-section h1 {
            font-size: 2rem;
            font-weight: 900;
            color: var(--color-red);
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }

        .header-section p {
            color: var(--color-gray);
            font-size: 0.9rem;
            font-weight: 600;
            opacity: 0.7;
        }

        .input-group {
            margin-bottom: 2.25rem;
            text-align: left;
        }

        .input-wrapper {
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1.5px solid rgba(222, 216, 198, 0.1);
        }

        .input-wrapper:focus-within {
            border-color: var(--color-red);
            box-shadow: 0 0 0 5px rgba(230, 82, 55, 0.15);
        }

        .custom-input {
            width: 100%;
            background: transparent;
            border: none;
            border-radius: 16px;
            padding: 1.125rem 1rem;
            color: var(--color-cream);
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.5em;
            outline: none;
        }

        .submit-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--color-red) 0%, #c13d28 100%);
            color: white;
            border: none;
            border-radius: 16px;
            padding: 1.25rem;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            box-shadow: 0 10px 20px -5px rgba(230, 82, 55, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 30px -10px rgba(230, 82, 55, 0.6);
        }

        .resend-btn {
            background: transparent;
            color: var(--color-gray);
            border: 1px solid rgba(222, 216, 198, 0.1);
            border-radius: 12px;
            padding: 0.75rem;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 1rem;
        }

        .resend-btn:hover {
            background: rgba(255, 251, 237, 0.05);
            color: var(--color-cream);
            border-color: var(--color-red);
        }

        .error-box {
            background: rgba(230, 82, 55, 0.1);
            border: 1px solid rgba(230, 82, 55, 0.2);
            color: #ff8c7a;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            font-size: 0.85rem;
            text-align: center;
        }

        .status-box {
            background: rgba(255, 221, 85, 0.1);
            border: 1px solid rgba(255, 221, 85, 0.2);
            color: var(--color-yellow);
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            font-size: 0.85rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="header-section">
            <i class="fas fa-shield-alt"></i>
            <h1>Two-Step Verification</h1>
            <p>Please enter the 6-digit code sent to your email address.</p>
        </div>

        @if(session('status'))
            <div class="status-box">
                {{ session('status') }}
            </div>
        @endif

        @if($errors->any())
            <div class="error-box">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('admin.otp.verify') }}">
            @csrf
            
            <div class="input-group">
                <div class="input-wrapper">
                    <input 
                        id="otp" 
                        class="custom-input" 
                        type="text" 
                        name="otp" 
                        placeholder="000000"
                        maxlength="6"
                        required 
                        autofocus 
                        autocomplete="one-time-code"
                    />
                </div>
            </div>

            <button type="submit" class="submit-btn">
                <span>Verify & Login</span>
                <i class="fas fa-check-circle"></i>
            </button>
        </form>

        <form method="POST" action="{{ route('admin.otp.resend') }}">
            @csrf
            <button type="submit" class="resend-btn">
                <i class="fas fa-redo-alt mr-2"></i> Didn't receive code? Resend
            </button>
        </form>

        <div class="text-center mt-8">
            <a href="{{ route('admin.login') }}" class="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors">
                <i class="fas fa-arrow-left mr-2"></i> Back to Login
            </a>
        </div>
    </div>

    <script>
        // Auto-focus and only numbers for OTP
        const otpInput = document.getElementById('otp');
        otpInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    </script>
</body>
</html>
