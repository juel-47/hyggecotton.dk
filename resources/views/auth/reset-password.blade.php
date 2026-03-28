<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - {{ $settings?->site_name ?? 'Hygge Cotton' }}</title>
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
            color: var(--color-red);
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
        }

        .input-group {
            margin-bottom: 1.25rem;
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

        .password-toggle {
            position: absolute;
            right: 1.125rem;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: var(--color-gray);
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
            margin-top: 1rem;
        }

        .submit-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }

        .error-message {
            background: rgba(230, 82, 55, 0.1);
            color: #ff8c7a;
            padding: 0.625rem;
            border-radius: 8px;
            margin-top: 0.5rem;
            font-size: 0.75rem;
            border: 1px solid rgba(230, 82, 55, 0.1);
        }
    </style>
</head>
<body>
    <div class="reset-card">
        <div class="header-section">
            <i class="fas fa-key"></i>
            <h1>Secure Reset</h1>
            <p>Update your administrator credentials below.</p>
        </div>

        <form method="POST" action="{{ route('admin.password.store') }}">
            @csrf

            <!-- Password Reset Token -->
            <input type="hidden" name="token" value="{{ $request->route('token') }}">

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
                        value="{{ old('email', $request->email) }}" 
                        required 
                        readonly
                    />
                </div>
                @error('email')
                    <div class="error-message">{{ $message }}</div>
                @enderror
            </div>

            <!-- Password -->
            <div class="input-group">
                <label for="password">New Password</label>
                <div class="input-wrapper">
                    <i class="fas fa-lock"></i>
                    <input 
                        id="password" 
                        class="custom-input" 
                        type="password" 
                        name="password" 
                        placeholder="••••••••"
                        required 
                        autofocus
                    />
                    <span class="password-toggle" onclick="togglePassword('password')">
                        <i id="password-icon" class="fas fa-eye"></i>
                    </span>
                </div>
                @error('password')
                    <div class="error-message">{{ $message }}</div>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div class="input-group">
                <label for="password_confirmation">Confirm Password</label>
                <div class="input-wrapper">
                    <i class="fas fa-check-double"></i>
                    <input 
                        id="password_confirmation" 
                        class="custom-input" 
                        type="password" 
                        name="password_confirmation" 
                        placeholder="••••••••"
                        required 
                    />
                </div>
                @error('password_confirmation')
                    <div class="error-message">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="submit-btn">
                <span>Update Password</span>
                <i class="fas fa-save"></i>
            </button>
        </form>
    </div>

    <script>
        function togglePassword(id) {
            const input = document.getElementById(id);
            const icon = document.getElementById(id + '-icon');
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
