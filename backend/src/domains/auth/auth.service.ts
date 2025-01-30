import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register(registerDto: RegisterDto) {
        
        if (registerDto.password !== registerDto.confirmPassword){
            throw new BadRequestException("Les mots de passe sont différents");
        } 

        // Je créer une variable dans laquelle j'effectue une première requête pour récupérer un utilisateur avec le mail saisie
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        // Si un utilisateur avec le même email existe, je retour l'erreur
        if (existingUser) {
            throw new BadRequestException("L'email est déjà utilisé");
        }

        // Sinon, j'effectue la requête qui me permet de créer une nouvelle ligne dans la table User
        return this.prisma.user.create({
            data: {
                pseudo: registerDto.pseudo,
                email: registerDto.email,
                password: registerDto.password,
                birthday: registerDto.birthday,
            },
        });
    }

    async login(loginDto: LoginDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email : loginDto.email }
        })

        if (!existingUser) {
            throw new BadRequestException("L'email ne correspond à aucun compte")
        }

        if (existingUser.password !== loginDto.password) {
            throw new BadRequestException("Le mot de passe est incorrecte")
        }

        return existingUser
    }
}
