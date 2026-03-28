<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - {{ $settings?->site_name ?? 'Hygge Cotton' }}</title>
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

        .reset-card {
            width: 100%;
            max-width: 440px;
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 24px;
            padding: 3.5rem 2.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            margin: 1.5rem;
            border: 1px solid var(--glass-border);
            position: relative;
            overflow: hidden;
        }

        .reset-card::before {
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
            font-weight: 800;
            color: var(--color-cream);
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        .header-section p {
            color: var(--color-gray);
            font-size: 0.9rem;
            line-height: 1.7;
            opacity: 0.7;
            max-width: 340px;
            margin: 0 auto;
            font-weight: 500;
        }

        .input-group {
            margin-bottom: 2.25rem;
            text-align: left;
        }

        .input-group label {
            display: block;
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--color-gray);
            margin-bottom: 0.75rem;
            padding-left: 0.5rem;
            opacity: 0.8;
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
            background: rgba(0, 0, 0, 0.3);
            transform: translateY(-1px);
        }

        .input-wrapper i.field-icon {
            position: absolute;
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray);
            font-size: 1.2rem;
            pointer-events: none;
            transition: all 0.3s ease;
            opacity: 0.4;
        }

        .input-wrapper:focus-within i.field-icon {
            color: var(--color-red);
            opacity: 1;
            transform: translateY(-50%) scale(1.1);
        }

        .custom-input {
            width: 100%;
            background: transparent;
            border: none;
            border-radius: 16px;
            padding: 1.125rem 1rem 1.125rem 3.75rem;
            color: var(--color-cream);
            font-size: 1rem;
            font-weight: 500;
            outline: none;
            display: block;
        }

        .custom-input::placeholder {
            color: rgba(222, 216, 198, 0.2);
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
            filter: brightness(1.1);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            text-align: center;
            margin-top: 2.5rem;
            color: var(--color-gray);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 700;
            transition: all 0.3s ease;
            gap: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.6;
        }

        .back-link:hover {
            color: var(--color-red);
            opacity: 1;
            transform: translateX(-4px);
        }

        .error-message {
            background: rgba(230, 82, 55, 0.1);
            border: 1px solid rgba(230, 82, 55, 0.2);
            color: #ff8c7a;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            font-size: 0.85rem;
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .status-message {
            background: rgba(255, 221, 85, 0.1);
            border: 1px solid rgba(255, 221, 85, 0.2);
            color: var(--color-yellow);
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="reset-card">
        <div class="header-section">
            <i class="fas fa-shield-alt"></i>
            <h1>Account Recovery</h1>
            <p>Enter your administrator email and we'll send you a secure link to reset your password.</p>
        </div>

        @if(session('status'))
            <div class="status-message">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('admin.password.email') }}">
            @csrf

            <!-- Email Address -->
            <div class="input-group">
                <label for="email">Admin Email</label>
                <div class="input-wrapper">
                    <i class="fas fa-envelope field-icon"></i>
                    <input 
                        id="email" 
                        class="custom-input" 
                        type="email" 
                        name="email" 
                        value="{{ old('email') }}" 
                        placeholder="admin@hyggecotton.dk"
                        required 
                        autofocus 
                    />
                </div>
                @error('email')
                    <div class="error-message mt-2">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="submit-btn">
                <span>Send Reset Link</span>
                <i class="fas fa-paper-plane"></i>
            </button>
        </form>

        <a href="{{ route('admin.login') }}" class="back-link">
            <i class="fas fa-arrow-left"></i> Back to Login
        </a>
    </div>
</body>
</html>
