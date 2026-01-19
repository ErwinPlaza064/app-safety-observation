import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import ThemeToggle from "@/Components/ThemeToggle";

export default function Register({ areas = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_number: "",
        name: "",
        email: "",
        area: "",
        position: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const [showToast, setShowToast] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

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

    const submit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        setTimeout(() => {
            post(route("register"), {
                onSuccess: () => {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 5000);
                },
                onFinish: () => {
                    reset("password", "password_confirmation");
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
            <Head title="Registro" />
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {showToast && (
                <div className="fixed z-50 top-4 right-4 animate-slide-in">
                    <div className="flex items-center max-w-md gap-3 px-6 py-4 text-white bg-green-600 rounded-lg shadow-lg">
                        <svg
                            className="flex-shrink-0 w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <p className="font-semibold">Registro Exitoso</p>
                            <p className="text-sm">
                                Te hemos enviado un correo de verificación.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-auto text-white hover:text-gray-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <h2 className="mb-6 text-xl font-semibold text-center text-blue-900">
                Registro de Empleado
            </h2>

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="employee_number"
                        value="Número de Nómina"
                    />
                    <TextInput
                        id="employee_number"
                        name="employee_number"
                        value={data.employee_number}
                        className="block w-full mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) =>
                            setData("employee_number", e.target.value)
                        }
                        placeholder="Ej: 09015"
                    />
                    <InputError
                        message={errors.employee_number}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Nombre Completo" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                        autoComplete="name"
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Ej: Juan Pérez Martinez"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    <div>
                        <InputLabel
                            htmlFor="area"
                            value="Área / Departamento"
                        />
                        <select
                            id="area"
                            name="area"
                            value={data.area}
                            className="block w-full mt-1 text-sm bg-gray-100 border-transparent rounded-full shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-[9px]"
                            onChange={(e) => setData("area", e.target.value)}
                            required
                        >
                            <option value="">Selecciona...</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.area} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="position" value="Puesto / Cargo" />
                        <TextInput
                            id="position"
                            name="position"
                            value={data.position}
                            className="block w-full mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                            autoComplete="organization-job"
                            onChange={(e) =>
                                setData("position", e.target.value)
                            }
                            placeholder="Ej: Supervisor"
                        />
                        <InputError
                            message={errors.position}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo Corporativo" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="ejemplo@wasion.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                    <p className="mt-1 text-xs text-gray-500">
                        Solo se permiten correos @wasion.cn, @wasion.com o @wasionmx.onmicrosoft.com
                    </p>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full pr-10 mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Crear contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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
                                    className={`h-full transition-all duration-300 ${
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

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />
                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            type={
                                showPasswordConfirmation ? "text" : "password"
                            }
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pr-10 mt-1 text-sm bg-gray-100 rounded-full shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordConfirmation(
                                    !showPasswordConfirmation
                                )
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPasswordConfirmation ? (
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
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

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
                                Red   ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>Registrando...</span>
                        </div>
                    ) : (
                        "Registrarse"
                    )}
                </PrimaryButton>

                <div className="mt-4 text-center">
                    <Link
                        href={route("login")}
                        className="text-sm underline text-wasion hover:text-wasion-700"
                    >
                        ¿Ya tienes cuenta? Iniciar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
