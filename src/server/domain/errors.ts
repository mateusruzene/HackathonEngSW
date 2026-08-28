export class DomainError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class HackathonLotadoError extends DomainError {
  constructor(message = 'O Hackathon atingiu o limite máximo de equipes inscritas.') {
    super(message, 400);
  }
}

export class ParticipanteJaInscritoError extends DomainError {
  constructor(message = 'O participante já está inscrito em outra equipe neste Hackathon.') {
    super(message, 400);
  }
}

export class ProjetoJaCadastradoError extends DomainError {
  constructor(message = 'A equipe já possui um projeto cadastrado no Hackathon.') {
    super(message, 400);
  }
}

export class NotaInvalidaError extends DomainError {
  constructor(message = 'A nota de avaliação deve estar estritamente entre 0.0 e 10.0.') {
    super(message, 400);
  }
}

export class RecursoNaoEncontradoError extends DomainError {
  constructor(recurso = 'Recurso') {
    super(`${recurso} não encontrado(a).`, 404);
  }
}

export class ValidacaoError extends DomainError {
  constructor(message = 'Dados inválidos.') {
    super(message, 400);
  }
}
