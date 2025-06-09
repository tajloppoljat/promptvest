import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, Shield, Check } from "lucide-react";

interface PinLockProps {
  onUnlock: () => void;
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const CORRECT_PIN = "6415";
  const MAX_ATTEMPTS = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locked) return;
    
    if (pin === CORRECT_PIN) {
      setIsUnlocking(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowWelcome(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      onUnlock();
    } else {
      setAttempts(prev => prev + 1);
      setPin("");
      
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
        }, 30000); // 30 second lockout
      }
    }
  };

  const handlePinChange = (value: string) => {
    if (locked) return;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="mb-6 text-green-600">
            <Check className="h-20 w-20 mx-auto animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-slide-up">
            Welcome Back
          </h1>
          <p className="text-2xl text-green-600 font-medium animate-slide-up-delay">
            Abdullah Quraishi
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full animate-expand"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mb-4 text-gray-700">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Secure Access
          </h1>
          <p className="text-gray-600">
            Enter your PIN to access PromptVest
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="pl-10 text-center text-lg tracking-widest font-mono"
                disabled={locked || isUnlocking}
                autoComplete="off"
                maxLength={4}
              />
            </div>
            
            {attempts > 0 && !locked && (
              <p className="text-red-500 text-sm text-center">
                Incorrect PIN. {MAX_ATTEMPTS - attempts} attempts remaining.
              </p>
            )}
            
            {locked && (
              <p className="text-red-600 text-sm text-center font-medium">
                Too many failed attempts. Try again in 30 seconds.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={pin.length !== 4 || locked || isUnlocking}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3"
          >
            {isUnlocking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Unlocking...
              </div>
            ) : (
              "Unlock"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < pin.length ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs text-center text-gray-500">
          <p>🔒 Military-grade encryption protected</p>
        </div>
      </Card>
    </div>
  );
}