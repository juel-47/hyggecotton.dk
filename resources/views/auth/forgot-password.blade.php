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
            --color-dark-bg: #28261e;
            --color-dark-card: #37352b;
            --color-cream: #fffbed;
            --color-gray: #ded8c6;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--color-dark-bg);
            color: var(--color-cream);
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .reset-card {
            width: 100%;
            max-width: 440px;
            background: var(--color-dark-card);
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            margin: 1.5rem;
            border: 1px solid rgba(255, 251, 237, 0.05);
        }

        .header-section {
            text-align: center;
            margin-bottom: 2.25rem;
        }

        .header-section i {
            font-size: 3rem;
            color: var(--color-red);
            margin-bottom: 1.25rem;
            filter: drop-shadow(0 4px 12px rgba(230, 82, 55, 0.2));
        }

        .header-section h1 {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--color-cream);
            margin-bottom: 0.75rem;
            letter-spacing: -0.01em;
        }

        .header-section p {
            color: var(--color-gray);
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.8;
            max-width: 320px;
            margin: 0 auto;
        }

        .input-group {
            margin-bottom: 2rem;
            text-align: left;
        }

        .input-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-gray);
            margin-bottom: 0.625rem;
            padding-left: 0.25rem;
        }

        .input-wrapper {
            position: relative;
            background: #1e1c16;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(222, 216, 198, 0.1);
        }

        .input-wrapper:focus-within {
            border-color: var(--color-red);
            box-shadow: 0 0 0 4px rgba(230, 82, 55, 0.15);
            background: #23211a;
        }

        .input-wrapper i.field-icon {
            position: absolute;
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray);
            font-size: 1.1rem;
            pointer-events: none;
            transition: color 0.3s ease;
            opacity: 0.5;
        }

        .input-wrapper:focus-within i.field-icon {
            color: var(--color-red);
            opacity: 1;
        }

        .custom-input {
            width: 100%;
            background: transparent;
            border: none;
            border-radius: 12px;
            padding: 1rem 1rem 1rem 3.5rem;
            color: var(--color-cream);
            font-size: 1rem;
            outline: none;
            display: block;
        }

        .custom-input::placeholder {
            color: rgba(222, 216, 198, 0.3);
        }

        .submit-btn {
            width: 100%;
            background-color: var(--color-red);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1.125rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            box-shadow: 0 4px 12px rgba(230, 82, 55, 0.2);
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(230, 82, 55, 0.4);
            filter: brightness(1.05);
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
            margin-top: 2rem;
            color: var(--color-gray);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.2s ease;
            gap: 0.5rem;
        }

        .back-link:hover {
            color: var(--color-red);
        }

        .error-message {
            background: rgba(230, 82, 55, 0.1);
            border: 1px solid rgba(230, 82, 55, 0.2);
            color: #ff8c7a;
            padding: 0.875rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }

        .status-message {
            background: rgba(255, 221, 85, 0.1);
            border: 1px solid rgba(255, 221, 85, 0.2);
            color: var(--color-yellow);
            padding: 0.875rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
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
