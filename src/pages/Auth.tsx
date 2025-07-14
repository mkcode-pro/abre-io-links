import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para home
          </Link>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-md">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <LoginForm onToggleMode={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onToggleMode={() => setIsLogin(true)} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}