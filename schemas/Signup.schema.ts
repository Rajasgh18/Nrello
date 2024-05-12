import { z } from 'zod';
import SigninSchema from './Signin.schema';

export default SigninSchema.extend({
    name: z.string().min(3).max(50),
    confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ['confirmPassword']
})