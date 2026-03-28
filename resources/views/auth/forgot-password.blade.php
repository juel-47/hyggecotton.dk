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
            margin-bottom: 2rem;
        }

        .header-section i {
            font-size: 2.5rem;
            color: var(--color-yellow);
            margin-bottom: 1rem;
        }

        .header-section h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-cream);
            margin-bottom: 0.75rem;
        }

        .header-section p {
            color: var(--color-gray);
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }

        .input-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-gray);
            margin-bottom: 0.5rem;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper i {
            position: absolute;
            left: 1.125rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray);
            font-size: 1rem;
            pointer-events: none;
        }

        .custom-input {
            width: 100%;
            background: #28261e;
            border: 1px solid rgba(222, 216, 198, 0.15);
            border-radius: 12px;
            padding: 0.875rem 1rem 0.875rem 3rem;
            color: var(--color-cream);
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        }

        .custom-input:focus {
            border-color: var(--color-red);
            box-shadow: 0 0 0 3px rgba(230, 82, 55, 0.2);
        }

        .submit-btn {
            width: 100%;
            background-color: var(--color-red);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
        }

        .submit-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }

        .back-link {
            display: block;
            text-align: center;
            margin-top: 2rem;
            color: var(--color-gray);
            text-decoration: none;
            font-size: 0.875rem;
            transition: color 0.3s ease;
        }

        .back-link:hover {
            color: var(--color-yellow);
        }

        .error-message {
            background: rgba(230, 82, 55, 0.1);
            color: #ff8c7a;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.8125rem;
            border: 1px solid rgba(230, 82, 55, 0.1);
        }

        .status-message {
            background: rgba(255, 221, 85, 0.1);
            color: var(--color-yellow);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.8125rem;
            border: 1px solid rgba(255, 221, 85, 0.1);
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
                    <i class="fas fa-envelope"></i>
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
            <i class="fas fa-arrow-left mr-2"></i> Back to Login
        </a>
    </div>
</body>
</html>
