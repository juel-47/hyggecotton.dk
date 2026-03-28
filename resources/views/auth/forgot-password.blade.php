{{-- <x-guest-layout>
    <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {{ __('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.') }}
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('password.email') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div class="flex items-center justify-end mt-4">
            <x-primary-button>
                {{ __('Email Password Reset Link') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout> --}}
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
            overflow: hidden;
        }

        .login-container {
            width: 100%;
            max-width: 450px;
            padding: 2rem;
            position: relative;
            z-index: 10;
        }

        .ambient-orb {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 1;
            opacity: 0.15;
            animation: orbFloat 20s infinite alternate;
        }

        @keyframes orbFloat {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        .orb-1 {
            background: var(--color-red);
            top: -100px;
            right: -100px;
        }

        .orb-2 {
            background: var(--color-yellow);
            bottom: -100px;
            left: -100px;
        }

        .glass-card {
            background: rgba(55, 53, 43, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 251, 237, 0.1);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo-area {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo-icon {
            font-size: 3rem;
            color: var(--color-red);
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--color-cream);
            margin-bottom: 0.5rem;
        }

        p.description {
            color: var(--color-gray);
            font-size: 0.875rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .input-group {
            margin-bottom: 2rem;
            position: relative;
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
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray);
            font-size: 1rem;
            pointer-events: none;
        }

        .custom-input {
            width: 100%;
            background: rgba(40, 38, 30, 0.5);
            border: 1px solid rgba(222, 216, 198, 0.2);
            border-radius: 12px;
            padding: 0.875rem 1rem 0.875rem 3.25rem;
            color: var(--color-cream);
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        }

        .custom-input:focus {
            border-color: var(--color-red);
            background: rgba(40, 38, 30, 0.8);
            box-shadow: 0 0 0 4px rgba(230, 82, 55, 0.15);
        }

        .submit-button {
            width: 100%;
            background: linear-gradient(135deg, var(--color-red) 0%, #b33d27 100%);
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
            box-shadow: 0 10px 20px -5px rgba(230, 82, 55, 0.4);
        }

        .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 25px -5px rgba(230, 82, 55, 0.5);
        }

        .back-link {
            display: block;
            text-align: center;
            margin-top: 2rem;
            color: var(--color-gray);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .back-link:hover {
            color: var(--color-yellow);
        }

        .error-message {
            background: rgba(230, 82, 55, 0.1);
            border-left: 4px solid var(--color-red);
            color: #ff8c7a;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }

        .status-message {
            background: rgba(255, 221, 85, 0.1);
            border-left: 4px solid var(--color-yellow);
            color: var(--color-yellow);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>

    <div class="login-container">
        <div class="glass-card">
            <div class="logo-area">
                <div class="logo-icon">
                    <i class="fas fa-key"></i>
                </div>
                <h1>Forgot Password?</h1>
                <p class="description">
                    {{ __('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.') }}
                </p>
            </div>

            <!-- Session Status -->
            @if(session('status'))
                <div class="status-message">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('password.email') }}">
                @csrf

                <!-- Email Address -->
                <div class="input-group">
                    <label for="email">Email Address</label>
                    <div class="input-wrapper">
                        <i class="fas fa-envelope"></i>
                        <input 
                            id="email" 
                            class="custom-input" 
                            type="email" 
                            name="email" 
                            value="{{ old('email') }}" 
                            placeholder="admin@example.com"
                            required 
                            autofocus 
                        />
                    </div>
                    @error('email')
                        <div class="error-message mt-2">{{ $message }}</div>
                    @enderror
                </div>

                <button type="submit" class="submit-button">
                    <span>Send Reset Link</span>
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>

            <a href="{{ route('admin.login') }}" class="back-link">
                <i class="fas fa-arrow-left mr-2"></i> Back to Login
            </a>
        </div>
    </div>
</body>
</html>
