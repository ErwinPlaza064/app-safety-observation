import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import ThemeToggle from "@/Components/ThemeToggle";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        setTimeout(() => {
            post(route("login"), {
                onFinish: () => {
                    reset("password");
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            });
        }, 1500);
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <form onSubmit={submit}>
                <h2 className="mb-6 text-lg text-center text-blue-900 dark:text-blue-400">
                    Iniciar Sesión
                </h2>

                <div>
                    <InputLabel
                        htmlFor="login"
                        value="Número de Nómina o Correo Electrónico"
                    />

                    <TextInput
                        id="login"
                        type="text"
                        name="login"
                        value={data.login}
                        className="block w-full py-3 mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("login", e.target.value)}
                        placeholder="Ingrese su número de nómina o correo"
                    />

                    <InputError message={errors.login} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full py-3 pr-10 mt-1 text-sm bg-gray-100 rounded-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Ingrese su contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Recordar mi sesión
                        </span>
                    </label>

                    <Link
                        href={route("register")}
                        className="ml-10 text-sm text-center underline lg:ml-0 text-wasion dark:text-blue-400 hover:text-wasion-700 dark:hover:text-blue-300"
                    >
                        ¿No tienes cuenta? <hr /> <b>Regístrate</b>
                    </Link>
                </div>
                {status && (
                    <div className="mt-2 text-sm font-medium text-center text-green-600">
                        {status}
                    </div>
                )}

                <PrimaryButton
                    className="w-full mt-6"
                    disabled={processing || isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="w-5 h-5 mr-2 text-white animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>Iniciando sesión...</span>
                        </div>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </PrimaryButton>

                {canResetPassword && (
                    <div className="mt-4 text-center">
                        <Link
                            href={route("password.request")}
                            className="text-sm text-gray-600 underline dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            ¿Olvidó su contraseña?
                        </Link>
                    </div>
                )}

                <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    <p>¿Necesitas ayuda? Contacte con el equipo de IT:</p>
                    <a
                        href="https://wasionithelp.freshservice.com"
                        className="text-wasion dark:text-blue-400 hover:underline"
                    >
                        wasionithelp.freshservice.com
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}
