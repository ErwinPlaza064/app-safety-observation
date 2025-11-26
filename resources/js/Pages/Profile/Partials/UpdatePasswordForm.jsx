import { useRef, useState, useMemo } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showToast, setShowToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const passwordStrength = useMemo(() => {
        const password = data.password;
        if (!password) return null;

        let strength = 0;
        let label = "";
        let color = "";

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            label = "Débil";
            color = "bg-red-500 text-red-600";
        } else if (strength === 3) {
            label = "Media";
            color = "bg-orange-500 text-orange-600";
        } else if (strength === 4) {
            label = "Fuerte";
            color = "bg-yellow-500 text-yellow-600";
        } else {
            label = "Muy Segura";
            color = "bg-green-500 text-green-600";
        }

        return { strength, label, color, percentage: (strength / 5) * 100 };
    }, [data.password]);

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowToast(true);

                setTimeout(() => {
                    router.post(route("logout"));
                }, 2000);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            {showToast && (
                <div className="fixed z-50 top-4 right-4 animate-slide-in">
                    <div className="flex items-center max-w-md gap-3 px-6 py-4 text-white bg-green-600 rounded-lg shadow-lg">
                        <svg
                            className="flex-shrink-0 w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <p className="font-semibold">
                                Contraseña Actualizada
                            </p>
                            <p className="text-sm">
                                Cerrando sesión por seguridad...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Actualizar Contraseña
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Asegúrate de que tu cuenta esté usando una contraseña larga
                    y segura para mantenerte protegido.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Contraseña Actual"
                    />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nueva Contraseña" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            type={showPassword ? "text" : "password"}
                            className="block w-full pr-10 mt-1"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1 text-gray-500 hover:text-gray-700"
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

                    {passwordStrength && (
                        <div className="mt-2 animate-fade-in">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">
                                    Fortaleza:
                                </span>
                                <span
                                    className={`text-xs font-bold ${
                                        passwordStrength.color.split(" ")[1]
                                    }`}
                                >
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="w-full h-1.5 overflow-hidden bg-gray-200 rounded-full">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        passwordStrength.color.split(" ")[0]
                                    }`}
                                    style={{
                                        width: `${passwordStrength.percentage}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="mt-1 text-[10px] text-gray-400">
                                Usa 8+ caracteres, mayúsculas, números y
                                símbolos.
                            </p>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="block w-full mt-1"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
