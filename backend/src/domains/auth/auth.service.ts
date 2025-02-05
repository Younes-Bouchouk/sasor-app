import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        const { pseudo, email, password, confirmPassword, birthday } =
            registerDto;

        // Je vérifie si les champs 'mot de passe' et 'confirmer mot de passe' sont différents
        if (password !== confirmPassword) { throw new BadRequestException('Les mots de passe sont différents'); }

        // Je créer une variable dans laquelle j'effectue une requête pour récupérer un utilisateur avec l'email saisie
        const existingUser = await this.prisma.user.findUnique({ where: { email: email } });

        // Si un utilisateur avec le même email existe, je retour l'erreur
        if (existingUser) {
            throw new BadRequestException("L'email est déjà utilisé");
        }

        const hashedPassword = await hash(password, 10);

        // Sinon, j'effectue la requête qui me permet de créer une nouvelle ligne dans la table User
        return this.prisma.user.create({
            data: {
                pseudo,
                email,
                password: hashedPassword,
                birthday,
            }
        });
    }

    async login(loginDto: LoginDto) {
        // Vérifie que l'user existe
        const existingUser = await this.prisma.user.findUnique({ where: { email: loginDto.email } });
        if (!existingUser) { throw new BadRequestException("L'email ne correspond à aucun compte") }

        // Vérifier le mot de passe est correcte
        const isPasswordValid = await compare(loginDto.password, existingUser.password);
        if (!isPasswordValid) { throw new BadRequestException('Le mot de passe est incorrect'); }


        const payload = { sub: existingUser.id, pseudo: existingUser.pseudo };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
