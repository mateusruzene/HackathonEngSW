import { z } from 'zod';

export const CriarHackathonSchema = z.object({
  nome: z.string().min(3, 'O nome do Hackathon deve ter no mínimo 3 caracteres'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataTermino: z.string().min(1, 'Data de término é obrigatória'),
  maxEquipes: z.number().int().positive().default(10),
  descricao: z.string().optional().default('')
});

export const CadastrarParticipanteSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail institucional inválido'),
  curso: z.string().min(2, 'Curso é obrigatório'),
  grr: z.string().min(4, 'GRR/Matrícula é obrigatória')
});

export const InscreverEquipeSchema = z.object({
  hackathonId: z.number().int().positive('Hackathon ID é obrigatório'),
  nome: z.string().min(2, 'Nome da equipe é obrigatório'),
  participanteIds: z.array(z.number().int().positive()).min(1, 'A equipe deve ter pelo menos 1 participante')
});

export const RegistrarProjetoSchema = z.object({
  equipeId: z.number().int().positive('Equipe ID é obrigatória'),
  titulo: z.string().min(3, 'Título do projeto é obrigatório'),
  descricao: z.string().min(10, 'Descrição detalhada é obrigatória'),
  areaTematica: z.string().min(2, 'Área temática é obrigatória')
});

export const CadastrarMentorSchema = z.object({
  nome: z.string().min(2, 'Nome do mentor é obrigatório'),
  email: z.string().email('E-mail inválido'),
  especialidade: z.string().min(2, 'Especialidade é obrigatória')
});

export const RegistrarMentoriaSchema = z.object({
  mentorId: z.number().int().positive('Mentor ID é obrigatório'),
  equipeId: z.number().int().positive('Equipe ID é obrigatória'),
  comentarios: z.string().min(5, 'Comentários da mentoria são obrigatórios'),
  dataHora: z.string().optional()
});

export const CadastrarJuradoSchema = z.object({
  nome: z.string().min(2, 'Nome do jurado é obrigatório'),
  email: z.string().email('E-mail inválido'),
  areaAtuacao: z.string().min(2, 'Área de atuação é obrigatória')
});

export const RegistrarAvaliacaoSchema = z.object({
  juradoId: z.number().int().positive('Jurado ID é obrigatório'),
  projetoId: z.number().int().positive('Projeto ID é obrigatório'),
  nota: z.number().min(0.0, 'A nota mínima é 0.0').max(10.0, 'A nota máxima é 10.0'),
  comentarios: z.string().optional().default(''),
  dataHora: z.string().optional()
});

export type CriarHackathonInput = z.infer<typeof CriarHackathonSchema>;
export type CadastrarParticipanteInput = z.infer<typeof CadastrarParticipanteSchema>;
export type InscreverEquipeInput = z.infer<typeof InscreverEquipeSchema>;
export type RegistrarProjetoInput = z.infer<typeof RegistrarProjetoSchema>;
export type CadastrarMentorInput = z.infer<typeof CadastrarMentorSchema>;
export type RegistrarMentoriaInput = z.infer<typeof RegistrarMentoriaSchema>;
export type CadastrarJuradoInput = z.infer<typeof CadastrarJuradoSchema>;
export type RegistrarAvaliacaoInput = z.infer<typeof RegistrarAvaliacaoSchema>;
