import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Shield, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Note } from "@/lib/data";

const Admin = () => {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const verifyPassword = async () => {
        // Determine connection by trying to fetch pending notes
        // If we get 401/403, we know password is wrong
        // If we get 200, we are good
        setLoading(true);
        try {
            const response = await api.get("/admin/pending", {
                headers: { "x-admin-password": password },
            });
            setNotes(response.data);
            setIsAuthenticated(true);
            toast({ title: "Welcome back, Admin! 🛡️" });
        } catch (error: any) {
            toast({
                title: "Access Denied 🔒",
                description: "Invalid Master Key",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        try {
            if (action === "approve") {
                await api.patch(
                    `/admin/approve/${id}`,
                    {},
                    { headers: { "x-admin-password": password } }
                );
                toast({ title: "Note Approved! ✅" });
            } else {
                await api.delete(`/admin/reject/${id}`, {
                    headers: { "x-admin-password": password },
                });
                toast({ title: "Note Rejected ❌" });
            }
            // Remove from list
            setNotes((prev) => prev.filter((n) => n._id !== id));
        } catch (error) {
            toast({
                title: "Action Failed",
                variant: "destructive",
            });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 glass rounded-xl brutal-border text-center"
                >
                    <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
                    <p className="text-muted-foreground mb-6">Enter the Master Key to manage notes</p>

                    <div className="relative mb-4">
                        <KeyRound className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Master Key"
                            className="w-full pl-10 pr-4 py-2.5 bg-input rounded-md brutal-border focus:ring-2 focus:ring-primary outline-none"
                            onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
                        />
                    </div>

                    <button
                        onClick={verifyPassword}
                        disabled={loading || !password}
                        className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-md brutal-shadow hover:translate-y-[-2px] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Unlock Dashboard"}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Managing {notes.length} pending notes</p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm font-semibold hover:text-primary transition-colors"
                    >
                        Logout
                    </button>
                </header>

                {notes.length === 0 ? (
                    <div className="text-center py-20 glass rounded-xl brutal-border">
                        <p className="text-xl font-bold text-muted-foreground">All caught up! 🎉</p>
                        <p className="text-sm text-muted-foreground mt-2">No pending notes needing approval.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {notes.map((note) => (
                                <motion.div
                                    key={note._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-card p-4 rounded-lg brutal-border flex flex-col md:flex-row items-center gap-4 justify-between"
                                >
                                    <div className="flex items-center gap-4 flex-1 w-full">
                                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                                            {note.fileUrl?.endsWith(".pdf") ? "📄" : "🖼️"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold truncate">{note.fileName || note.subject}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {note.subject} • Unit {note.unit} • {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <a
                                            href={note.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold underline decoration-dotted hover:text-primary mr-2"
                                        >
                                            View File
                                        </a>
                                        <button
                                            onClick={() => handleAction(note._id, "reject")}
                                            className="flex-1 md:flex-none px-4 py-2 bg-destructive/10 text-destructive font-bold rounded-md hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(note._id, "approve")}
                                            className="flex-1 md:flex-none px-4 py-2 bg-green-500/10 text-green-600 font-bold rounded-md hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
