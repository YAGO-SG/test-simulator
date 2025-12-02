# Especificação Completa da MIC-1

**Simulador de Máquina MIC-1 com Arquitetura de 16 bits**

---

## 📋 Instruções Base (0x0000 - 0x0E00)

Todas as instruções base operam no formato: `OPCODE (4 bits) | Endereço/Argumento (12 bits)`

### Instruções Diretas

| Binário | Hex | Mnemônico | Instrução | Significado | Flags |
|---------|-----|-----------|-----------|-------------|-------|
| `0000 xxxx xxxx xxxx` | `0x0000` | **LODD** | Carrega Direto | `ac = m[x]` | Z,N |
| `0001 xxxx xxxx xxxx` | `0x1000` | **STOD** | Armazena Direto | `m[x] = ac` | — |
| `0010 xxxx xxxx xxxx` | `0x2000` | **ADDD** | Adiciona Direto | `ac = ac + m[x]` | Z,N,C |
| `0011 xxxx xxxx xxxx` | `0x3000` | **SUBD** | Subtrai Direto | `ac = ac - m[x]` | Z,N,C |
| `0100 xxxx xxxx xxxx` | `0x0400` | **JPOS** | Desvia se Positivo | `if ac ≥ 0 then pc = x` | — |
| `0101 xxxx xxxx xxxx` | `0x0500` | **JZER** | Desvia se Zero | `if ac = 0 then pc = x` | — |
| `0110 xxxx xxxx xxxx` | `0x0600` | **JUMP** | Desvia (Incondicional) | `pc = x` | — |
| `0111 xxxx xxxx xxxx` | `0x0700` | **LOCO** | Carrega Constante | `ac = x` | Z,N |

### Instruções Locais (com Stack Pointer)

| Binário | Hex | Mnemônico | Instrução | Significado | Flags |
|---------|-----|-----------|-----------|-------------|-------|
| `1000 xxxx xxxx xxxx` | `0x0800` | **LODL** | Carrega Local | `ac = m[x + sp]` | Z,N |
| `1001 xxxx xxxx xxxx` | `0x0900` | **STOL** | Armazena Local | `m[x + sp] = ac` | — |
| `1010 xxxx xxxx xxxx` | `0x0A00` | **ADDL** | Adiciona Local | `ac = ac + m[x + sp]` | Z,N,C |
| `1011 xxxx xxxx xxxx` | `0x0B00` | **SUBL** | Subtrai Local | `ac = ac - m[x + sp]` | Z,N,C |
| `1100 xxxx xxxx xxxx` | `0x0C00` | **JNEG** | Desvia se Negativo | `if ac < 0 then pc = x` | — |
| `1101 xxxx xxxx xxxx` | `0x0D00` | **JNZE** | Desvia se Não Zero | `if ac ≠ 0 then pc = x` | — |
| `1110 xxxx xxxx xxxx` | `0x0E00` | **CALL** | Chama Procedimento | `sp--; m[sp] = pc; pc = x` | — |

---

## 🔧 Macroinstruções (0xF000 - 0xF700)

Composições de instruções base para operações comuns.

| Binário | Hex | Mnemônico | Instrução | Significado |
|---------|-----|-----------|-----------|-------------|
| `1111 0000 0000 0000` | `0xF000` | **PSHI** | Empilha Indireto | `sp--; m[sp] = m[ac];` |
| `1111 0001 0000 0000` | `0xF100` | **POPI** | Desempilha Indireto | `m[sp] = m[ac]; sp++` |
| `1111 0010 0000 0000` | `0xF200` | **PUSH** | Coloca na Pilha | `sp--; m[sp] = ac` |
| `1111 0011 0000 0000` | `0xF300` | **POP** | Retira da Pilha | `ac = m[sp]; sp++` |
| `1111 0100 0000 0000` | `0xF400` | **RETN** | Retorna | `pc = m[sp]; sp++` |
| `1111 0101 0000 0000` | `0xF500` | **SWAP** | Troca AC com SP | `temp := ac; ac := sp; sp := temp;` |
| `1111 0110 yyyy yyyy` | `0xF600` | **INSP** | Incrementa SP | `sp = sp + y` |
| `1111 0111 yyyy yyyy` | `0xF700` | **DESP** | Decrementa SP | `sp = sp - y` |

---

## 📍 Registradores Especiais

| Registrador | Sigla | Descrição |
|-------------|-------|-----------|
| Acumulador | **AC** | Registrador de resultado; alvo de operações aritméticas |
| Program Counter | **PC** | Endereço da próxima instrução a executar |
| Stack Pointer | **SP** | Topo da pilha; incrementado/decrementado por operações de pilha |
| Memory Address Register | **MAR** | Endereço de memória para leitura/escrita |
| Memory Buffer Register | **MBR** | Buffer de dados (read/write) da memória |
| Accumulator Shadow | **AC'** | Cópia do AC para operações |

---

## 🚩 Flags de Status (ALU)

| Flag | Sigla | Descrição |
|------|-------|-----------|
| Zero | **Z** | Definida se resultado = 0 |
| Negative | **N** | Definida se resultado < 0 |
| Carry | **C** | Definida se overflow em adição |

---

## 📊 Mapa de Memória

| Endereço | Tamanho | Propósito |
|----------|--------|----------|
| `0x0000 - 0x00FF` | 256 | Código (programa montado) |
| `0x0100 - 0x7FFF` | ~32K | Dados e Stack |
| `0x8000+` | — | Reservado |

---

## 🔄 Exemplo de Programa Simples

```assembly
; Soma dois números em memória
LOCO 5      ; ac = 5
STOD 100    ; m[100] = 5
LOCO 3      ; ac = 3
ADDD 100    ; ac = ac + m[100] = 3 + 5 = 8
STOD 101    ; m[101] = 8
JUMP 0      ; Loop infinito
```

**Compilado em memória:**
```
Addr  | Instrução | Binário
0     | LOCO 5    | 0111 0000 0000 0101 = 0x7005
1     | STOD 100  | 0001 0000 0110 0100 = 0x1064
2     | LOCO 3    | 0111 0000 0000 0011 = 0x7003
3     | ADDD 100  | 0010 0000 0110 0100 = 0x2064
4     | STOD 101  | 0001 0000 0110 0101 = 0x1065
5     | JUMP 0    | 0110 0000 0000 0000 = 0x6000
```

---

## 📝 Legenda de Formatos

- **x** = Argumento de endereço (12 bits, 0-4095)
- **y** = Argumento de imediato (8 bits, 0-255)
- **ac** = Registrador Acumulador
- **m[addr]** = Conteúdo da memória em endereço
- **sp** = Stack Pointer
- **pc** = Program Counter
- **Z, N, C** = Flags de Zero, Negativo, Carry

---

**Versão**: 1.0  
**Última atualização**: 29 de Novembro de 2025  
**Status**: ✅ Conforme especificação MIC-1 do PDF
