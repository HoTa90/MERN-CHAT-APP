import { useActionState, useState } from "react";
import { Link } from "react-router";
import { BotMessageSquare, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import ImagePattern from "../components/ImagePattern.jsx";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const { register } = useAuthStore();

	const validateForm = (formData) => {
		const {
			fullName = "",
			email = "",
			password = "",
		} = Object.fromEntries(formData);

		if (!fullName.trim()) {
			toast.error("Full name is required.");
			return false;
		}
		if (!email.trim()) {
			toast.error("Email is required.");
			return false;
		}
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			toast.error("Enter a valid email.");
			return false;
		}
		if (!password) {
			toast.error("Password is required.");
			return false;
		}
		if (password.length < 6) {
			toast.error("Password must be ≥ 6 characters.");
			return false;
		}

		return true;
	};

	const [, formAction, isPending] = useActionState(
		(prev, formData) => registerAction(prev, formData, register),
		null
	);

	async function registerAction(_, formData, register) {
		const values = Object.fromEntries(formData);
		const success = validateForm(formData);
		if (success) {
			await register(values);
		}

		return null;
	}

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* left side */}
			<div className="flex flex-col justify-center items-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-8">
					{/* LOGO */}
					<div className="text-center mb-8">
						<div className="flex flex-col items-center gap-2 group">
							<div
								className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors">
								<BotMessageSquare className="size-9 text-primary" />
							</div>
							<h1 className="text-2xl font-bold mt-2">
								Create Account
							</h1>
							<p className="text-base-content/60">
								Get started with your free account
							</p>
						</div>
					</div>

					<form action={formAction} className="space-y-6">
						<div className="form-control">
							<label className="label" htmlFor="fullName">
								<span className="label-text font-medium">
									Full Name
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="fullName"
									name="fullName"
									type="text"
									className="input input-bordered w-full pl-10"
									placeholder="John Doe"
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label" htmlFor="email">
								<span className="label-text font-medium">
									Email
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									className="input input-bordered w-full pl-10"
									placeholder="you@example.com"
								/>
							</div>
						</div>

						<div className="form-control">
							<label className="label" htmlFor="password">
								<span className="label-text font-medium">
									Password
								</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="size-5 text-base-content/40 z-10" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									className="input input-bordered w-full pl-10"
									placeholder="******"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									aria-label={
										showPassword
											? "Hide password"
											: "Show password"
									}
									onClick={() =>
										setShowPassword(!showPassword)
									}>
									{showPassword ? (
										<EyeOff className="size-5 text-base-content/40" />
									) : (
										<Eye className="size-5 text-base-content/40" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={isPending}>
							{isPending
								? "Creating Account..."
								: "	Create Account"}
						</button>
					</form>

					<div className="text-center">
						<p className="text-base-content/60">
							Already have an account?{" "}
							<Link to="/login" className="link link-primary">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* right side */}

			<ImagePattern />
		</div>
	);
}
