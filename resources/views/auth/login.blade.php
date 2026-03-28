<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - {{ $settings?->site_name ?? 'Hygge Cotton' }}</title>
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

        .login-card {
            width: 100%;
            max-width: 440px;
            background: var(--color-dark-card);
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            margin: 1.5rem;
            border: 1px solid rgba(255, 251, 237, 0.05);
        }

        .logo-section {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .logo-section h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--color-cream);
            letter-spacing: -0.02em;
        }

        .logo-section p {
            color: var(--color-gray);
            font-size: 0.875rem;
            margin-top: 0.5rem;
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
            left: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-gray);
            font-size: 1rem;
            pointer-events: none;
            transition: color 0.3s ease;
        }

        .custom-input {
            width: 100%;
            background: #28261e;
            border: 1px solid rgba(222, 216, 198, 0.15);
            border-radius: 12px;
            padding: 0.875rem 1rem 0.875rem 3.25rem;
            color: var(--color-cream);
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
        }

        .custom-input:focus {
            border-color: var(--color-red);
            box-shadow: 0 0 0 3px rgba(230, 82, 55, 0.2);
        }

        .custom-input:focus + i {
            color: var(--color-red);
        }

        .password-toggle {
            position: absolute;
            right: 1.25rem;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: var(--color-gray);
        }

        .options-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            font-size: 0.875rem;
        }

        .remember-me {
            display: flex;
            align-items: center;
            color: var(--color-gray);
            cursor: pointer;
        }

        .remember-me input {
            margin-right: 0.5rem;
            accent-color: var(--color-red);
        }

        .forgot-pass-link {
            color: var(--color-yellow);
            text-decoration: none;
            font-weight: 500;
        }

        .forgot-pass-link:hover {
            text-decoration: underline;
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
            gap: 0.5rem;
        }

        .submit-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
            box-shadow: 0 8px 15px rgba(230, 82, 55, 0.3);
        }

        .error-box {
            background: rgba(230, 82, 55, 0.1);
            border: 1px solid rgba(230, 82, 55, 0.2);
            color: #ff8c7a;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.8125rem;
        }

        .status-box {
            background: rgba(255, 221, 85, 0.1);
            border: 1px solid rgba(255, 221, 85, 0.2);
            color: var(--color-yellow);
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.8125rem;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="logo-section">
            <h1 style="color: var(--color-red);">HYGGE COTTON</h1>
            <p>Admin Control Dashboard</p>
        </div>

        @if(session('status'))
            <div class="status-box">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email Address -->
            <div class="input-group">
                <label for="email">E-Mail Address</label>
                <div class="input-wrapper">
                    <i class="fas fa-user-circle"></i>
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
                    <div class="error-box mt-2">{{ $message }}</div>
                @enderror
            </div>

            <!-- Password -->
            <div class="input-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                    <i class="fas fa-lock"></i>
                    <input 
                        id="password" 
                        class="custom-input" 
                        type="password" 
                        name="password" 
                        placeholder="••••••••"
                        required 
                    />
                    <span class="password-toggle" onclick="togglePassword()">
                        <i id="toggle-icon" class="fas fa-eye"></i>
                    </span>
                </div>
                @error('password')
                    <div class="error-box mt-2">{{ $message }}</div>
                @enderror
            </div>

            <!-- Options Row -->
            <div class="options-row">
                <label class="remember-me">
                    <input type="checkbox" name="remember">
                    <span>Keep me signed in</span>
                </label>
                
                @if (Route::has('admin.password.request'))
                    <a class="forgot-pass-link" href="{{ route('admin.password.request') }}">
                        Forgot password?
                    </a>
                @endif
            </div>

            <button type="submit" class="submit-btn">
                <span>Access Dashboard</span>
                <i class="fas fa-chevron-right"></i>
            </button>
        </form>
    </div>

    <script>
        function togglePassword() {
            const input = document.getElementById('password');
            const icon = document.getElementById('toggle-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        }
    </script>
</body>
</html>
