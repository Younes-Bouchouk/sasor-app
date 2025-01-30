import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async register(registerDto: RegisterDto) {
        const {pseudo, email, password, confirmPassword, birthday} = registerDto
        // Je vérifie si les champs 'mot de passe' et 'confirmer mot de passe' sont différents
        if (password !== confirmPassword) {
            throw new BadRequestException('Les mots de passe sont différents');
        }

        // Je créer une variable dans laquelle j'effectue une requête pour récupérer un utilisateur avec l'email saisie
        const existingUser = await this.prisma.user.findUnique({
            where: { email: email },
        });

        // Si un utilisateur avec le même email existe, je retour l'erreur
        if (existingUser) {
            throw new BadRequestException("L'email est déjà utilisé");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Sinon, j'effectue la requête qui me permet de créer une nouvelle ligne dans la table User
        return this.userService.create({pseudo, email, password:hashedPassword, birthday})
    }

    async login(loginDto: LoginDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!existingUser) {
            throw new BadRequestException(
                "L'email ne correspond à aucun compte",
            );
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            existingUser.password,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Le mot de passe est incorrect');
        }

        return existingUser;
    }
}
