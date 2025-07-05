"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function LogInCard() {
    const router = useRouter()
    const [errors, setErrors] = useState({})
    const [serverErr, setServerErr] = useState(null)
    const [formData, setFormData] = useState({ name: "", email: "", password: "" })
    const [isLogin, setIsLogin] = useState(true)
    const [processing, setprocessing] = useState(false)


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" })
        }
    }

    const validateForm = () => {
        let newErrors = {}
        if (!formData.name.trim() && !isLogin) {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 3 && !isLogin) {
            newErrors.name = "Name should be of at least 3 characters"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!validateEmail(formData.email.trim())) {
            newErrors.email = "Please enter a valid email"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required"
        } else if (formData.password.trim().length < 5) {
            newErrors.message = "Password should be of atleast 5 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const signUp = async () => {
        setprocessing(true)
        try {
            const { name, email, password } = formData
            const response = await fetch('http://localhost:8000/api/user/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (data.error) {
                setServerErr(data.error)
                return
            }

            const token = data.token
            await localStorage.setItem("career-connect-token", token)
            router.push('/dashboard')
        } catch (error) {
            setServerErr("Something went wrong...")
            console.log(error)
        } finally {
            setprocessing(false)
        }
    }

    const logIn = async () => {
        setprocessing(true)
        try {
            const { email, password } = formData
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (data.error) {
                setServerErr(data.error)
                return
            }

            const token = data.token
            await localStorage.setItem("career-connect-token", token)
            router.push('/dashboard')
        } catch (error) {
            setServerErr("Something went wrong...")
            console.log(error)
        } finally {
            setprocessing(false)
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors(null)
        setServerErr(null)
        if (!validateForm()) return
        if (isLogin) {
            logIn()
            return
        }
        signUp()
    }

    
    return (
            <Card className="w-full max-w-md border-0 shadow-lg bg-background/90 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-2">
                        <Sparkles className="h-8 w-8 text-yellow-500" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-secondary via-yellow-500 to-primary">
                        {isLogin ? "Welcome back" : "Join CareerConnect"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {serverErr && (
                        <div className="mb-4 p-3 bg-red-50 flex justify-center text-red-600 text-sm rounded-md border border-red-200">
                            {serverErr}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={onChange}
                                    className="border-foreground/20 hover:border-foreground/40 focus-visible:ring-primary"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground/80">Email</Label>
                            <Input
                                name="email"
                                type="text"
                                placeholder="hello@example.com"
                                value={formData.email}
                                onChange={onChange}
                                className="border-foreground/20 hover:border-foreground/40 focus-visible:ring-primary"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground/80">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder={isLogin ? "Enter your password" : "Create a password (min 5 chars)"}
                                value={formData.password}
                                onChange={onChange}
                                className="border-foreground/20 hover:border-foreground/40 focus-visible:ring-primary"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary via-yellow-500 to-secondary"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    {isLogin ? "Sign in" : "Sign up"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-foreground/70">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-1 font-medium text-primary hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </CardContent>
            </Card>
    )
}

export default LogInCard