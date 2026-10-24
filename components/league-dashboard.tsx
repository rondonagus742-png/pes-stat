'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, CirclePlus, Crown, Globe2, LayoutDashboard, ListOrdered, MoreHorizontal, Trash2, Settings2, Shield, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Player = { id: string; name: string; initials: string; color: string }
type PlayerStat = { id: string; name: string; goals: number; assists: number; penalties: number; yellowCards: number; redCards: number; injuries: number }
type BracketMatch = { home: string; away: string; homeGoals: string; awayGoals: string; homePenalties?: string; awayPenalties?: string }
type CopaBracket = { semifinal1: BracketMatch; semifinal2: BracketMatch; final: BracketMatch }
type CopaVisualBracket = { round16: BracketMatch[]; quarterfinals: BracketMatch[]; semifinals: BracketMatch[]; final: BracketMatch }
type Match = { id: number; home: string; away: string; homeGoals: number; awayGoals: number; date: string; round: string; status?: 'played' | 'upcoming' }

const initialPlayers: Player[] = [
  { id: 'racing', name: 'Racing Club', initials: 'RC', color: 'bg-sky-500' },
  { id: 'river', name: 'River Plate', initials: 'RP', color: 'bg-rose-500' },
  { id: 'boca', name: 'Boca Juniors', initials: 'BJ', color: 'bg-amber-500' },
  { id: 'independiente', name: 'Independiente', initials: 'IN', color: 'bg-red-500' },
  { id: 'san-lorenzo', name: 'San Lorenzo', initials: 'SL', color: 'bg-indigo-500' },
  { id: 'estudiantes', name: 'Estudiantes', initials: 'ES', color: 'bg-violet-500' },
  { id: 'newells', name: "Newell's", initials: 'N', color: 'bg-orange-500' },
]

const initialMatches: Match[] = [
  { id: 1, home: 'racing', away: 'river', homeGoals: 3, awayGoals: 1, date: 'Hoy, 22:15', round: 'Fecha 4', status: 'played' },
  { id: 2, home: 'boca', away: 'independiente', homeGoals: 2, awayGoals: 2, date: 'Ayer, 23:00', round: 'Fecha 4', status: 'played' },
  { id: 3, home: 'san-lorenzo', away: 'estudiantes', homeGoals: 1, awayGoals: 0, date: 'Ayer, 22:30', round: 'Fecha 4', status: 'played' },
  { id: 4, home: 'newells', away: 'racing', homeGoals: 0, awayGoals: 2, date: '12 Jun, 22:00', round: 'Fecha 3', status: 'played' },
]

const tournamentData: Record<string, { players: Player[]; matches: Match[] }> = {
  'Champions League': {
    players: [
      { id: 'real-madrid', name: 'Real Madrid', initials: 'RM', color: 'bg-slate-500' },
      { id: 'barcelona', name: 'Barcelona', initials: 'FCB', color: 'bg-blue-600' },
      { id: 'bayern', name: 'Bayern Munich', initials: 'BM', color: 'bg-red-600' },
      { id: 'liverpool', name: 'Liverpool', initials: 'LIV', color: 'bg-red-800' },
      { id: 'psg', name: 'PSG', initials: 'PSG', color: 'bg-indigo-700' },
      { id: 'inter', name: 'Inter', initials: 'INT', color: 'bg-blue-800' },
    ],
    matches: [
      { id: 11, home: 'real-madrid', away: 'barcelona', homeGoals: 2, awayGoals: 1, date: 'Hoy, 22:15', round: 'Semifinal' },
      { id: 12, home: 'bayern', away: 'psg', homeGoals: 3, awayGoals: 2, date: 'Ayer, 23:00', round: 'Semifinal' },
      { id: 13, home: 'liverpool', away: 'inter', homeGoals: 1, awayGoals: 1, date: '12 Jun, 22:00', round: 'Cuartos' },
    ],
  },
  Mundial: {
    players: [
      { id: 'argentina', name: 'Argentina', initials: 'ARG', color: 'bg-sky-500' },
      { id: 'brasil', name: 'Brasil', initials: 'BRA', color: 'bg-yellow-500' },
      { id: 'francia', name: 'Francia', initials: 'FRA', color: 'bg-blue-700' },
      { id: 'alemania', name: 'Alemania', initials: 'ALE', color: 'bg-slate-700' },
      { id: 'espana', name: 'España', initials: 'ESP', color: 'bg-red-500' },
      { id: 'inglaterra', name: 'Inglaterra', initials: 'ING', color: 'bg-blue-500' },
    ],
    matches: [
      { id: 21, home: 'argentina', away: 'brasil', homeGoals: 2, awayGoals: 0, date: 'Hoy, 21:00', round: 'Fecha 2' },
      { id: 22, home: 'francia', away: 'alemania', homeGoals: 1, awayGoals: 1, date: 'Ayer, 22:00', round: 'Fecha 2' },
      { id: 23, home: 'espana', away: 'inglaterra', homeGoals: 3, awayGoals: 2, date: '12 Jun, 20:00', round: 'Fecha 1' },
    ],
  },
  Eurocopa: {
    players: [
      { id: 'espana-euro', name: 'España', initials: 'ESP', color: 'bg-red-500' },
      { id: 'italia', name: 'Italia', initials: 'ITA', color: 'bg-blue-600' },
      { id: 'portugal', name: 'Portugal', initials: 'POR', color: 'bg-emerald-600' },
      { id: 'paises-bajos', name: 'Países Bajos', initials: 'PB', color: 'bg-orange-500' },
      { id: 'belgica', name: 'Bélgica', initials: 'BEL', color: 'bg-yellow-600' },
      { id: 'croacia', name: 'Croacia', initials: 'CRO', color: 'bg-red-700' },
    ],
    matches: [
      { id: 31, home: 'espana-euro', away: 'italia', homeGoals: 2, awayGoals: 1, date: 'Hoy, 21:30', round: 'Fecha 3' },
      { id: 32, home: 'portugal', away: 'paises-bajos', homeGoals: 2, awayGoals: 2, date: 'Ayer, 21:00', round: 'Fecha 3' },
      { id: 33, home: 'belgica', away: 'croacia', homeGoals: 0, awayGoals: 1, date: '12 Jun, 19:00', round: 'Fecha 2' },
    ],
  },
  'Copa América': {
    players: [
      { id: 'argentina-ca', name: 'Argentina', initials: 'ARG', color: 'bg-sky-500' },
      { id: 'brasil-ca', name: 'Brasil', initials: 'BRA', color: 'bg-yellow-500' },
      { id: 'uruguay', name: 'Uruguay', initials: 'URU', color: 'bg-sky-700' },
      { id: 'colombia', name: 'Colombia', initials: 'COL', color: 'bg-yellow-600' },
      { id: 'chile', name: 'Chile', initials: 'CHI', color: 'bg-red-600' },
      { id: 'ecuador', name: 'Ecuador', initials: 'ECU', color: 'bg-blue-500' },
    ],
    matches: [
      { id: 41, home: 'argentina-ca', away: 'uruguay', homeGoals: 1, awayGoals: 0, date: 'Hoy, 22:00', round: 'Fecha 4' },
      { id: 42, home: 'brasil-ca', away: 'colombia', homeGoals: 2, awayGoals: 2, date: 'Ayer, 22:30', round: 'Fecha 4' },
      { id: 43, home: 'chile', away: 'ecuador', homeGoals: 1, awayGoals: 2, date: '12 Jun, 20:30', round: 'Fecha 3' },
    ],
  },
}

function countryFlag(name: string) {
  const flags: Record<string, string> = { 'Argentina': '🇦🇷', 'Brasil': '🇧🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Ecuador': '🇪🇨', 'México': '🇲🇽', 'Mexico': '🇲🇽', 'Panamá': '🇵🇦', 'Panama': '🇵🇦', 'Real Madrid': '🇪🇸', 'Barcelona': '🇪🇸', 'Bayern Munich': '🇩🇪', 'Liverpool': '🇬🇧', 'PSG': '🇫🇷', 'Inter': '🇮🇹', 'Francia': '🇫🇷', 'Alemania': '🇩🇪', 'España': '🇪🇸', 'Inglaterra': '🇬🇧', 'Perú': '🇵🇪', 'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴', 'Venezuela': '🇻🇪', 'Costa Rica': '🇨🇷', 'Estados Unidos': '🇺🇸', 'Canadá': '🇨🇦', 'Japón': '🇯🇵', 'Corea del Sur': '🇰🇷', 'Portugal': '🇵🇹', 'Países Bajos': '🇳🇱', 'Bélgica': '🇧🇪', 'Suiza': '🇨🇭', 'Austria': '🇦🇹', 'Serbia': '🇷🇸', 'Croacia': '🇭🇷', 'Dinamarca': '🇩���', 'Suecia': '🇸🇪' }
  const cleanName = name.replace(/\s+\(.*\)$/, '').trim()
  const flag = flags[cleanName] ?? '🌐'
  const code = [...flag].map((character) => String.fromCodePoint(character.codePointAt(0)! - 0x1f1e6 + 65)).join('').toLowerCase()
  return <img src={code.length === 2 ? `https://flagcdn.com/w40/${code}.png` : '/placeholder.svg'} alt={`Bandera de ${cleanName}`} className="mr-2 inline-block size-6 rounded-full object-cover align-middle" />
}

function calculateTable(players: Player[], matches: Match[]) {
  const stats = Object.fromEntries(players.map((player) => [player.id, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }]))
  matches.filter((match) => match.status === 'played').forEach(({ home, away, homeGoals, awayGoals }) => {
    if (!stats[home] || !stats[away]) return
    stats[home].played += 1; stats[away].played += 1
    stats[home].gf += homeGoals; stats[home].ga += awayGoals
    stats[away].gf += awayGoals; stats[away].ga += homeGoals
    if (homeGoals > awayGoals) { stats[home].won += 1; stats[away].lost += 1; stats[home].points += 3 }
    else if (homeGoals < awayGoals) { stats[away].won += 1; stats[home].lost += 1; stats[away].points += 3 }
    else { stats[home].drawn += 1; stats[away].drawn += 1; stats[home].points += 1; stats[away].points += 1 }
  })
  return players.map((player) => ({ ...player, ...stats[player.id], gd: stats[player.id].gf - stats[player.id].ga })).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
}

export function LeagueDashboard() {
  const defaultTournament = tournamentData['Champions League']
  const [players, setPlayers] = useState(defaultTournament.players)
  const [matches, setMatches] = useState(defaultTournament.matches)
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'players'>('overview')
  const [activeTournament, setActiveTournament] = useState('Champions League')
  const [showForm, setShowForm] = useState(false)
  const [home, setHome] = useState('racing'); const [away, setAway] = useState('river')
  const [homeGoals, setHomeGoals] = useState(''); const [awayGoals, setAwayGoals] = useState('')
  const [matchType, setMatchType] = useState<'played' | 'upcoming'>('played')
  const [matchDate, setMatchDate] = useState('')
  const [matchRound, setMatchRound] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamGroup, setNewTeamGroup] = useState<'A' | 'B'>('A')
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStat[]>>({})
  const [newPlayer, setNewPlayer] = useState({ name: '', goals: '0', assists: '0', penalties: '0', yellowCards: '0', redCards: '0', injuries: '0' })
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTournament.players[0].id)
  const [teamGroups, setTeamGroups] = useState<Record<string, 'A' | 'B'>>({})
  const [expandedLeaderboard, setExpandedLeaderboard] = useState({ goals: false, assists: false })
  const [copaBracket, setCopaBracket] = useState<CopaBracket>({ semifinal1: { home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' }, semifinal2: { home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' }, final: { home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' } })
  const [copaVisualBracket, setCopaVisualBracket] = useState<CopaVisualBracket>({ round16: Array.from({ length: 4 }, () => ({ home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' })), quarterfinals: Array.from({ length: 2 }, () => ({ home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' })), semifinals: Array.from({ length: 2 }, () => ({ home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' })), final: { home: '', away: '', homeGoals: '', awayGoals: '', homePenalties: '', awayPenalties: '' } })
  const [copaChampion, setCopaChampion] = useState('')
  const [persistenceLoaded, setPersistenceLoaded] = useState(false)
  const [tournamentStates, setTournamentStates] = useState<Record<string, { players: typeof defaultTournament.players; matches: typeof defaultTournament.matches; playerStats: Record<string, PlayerStat[]>; teamGroups: Record<string, 'A' | 'B'>; copaBracket: CopaBracket; copaVisualBracket: CopaVisualBracket; copaChampion: string }>>({})
  const saveQueueRef = useRef(Promise.resolve())

  useEffect(() => {
    const saved = window.localStorage.getItem('pes6-league')
    if (saved) {
      const parsed = JSON.parse(saved)
      const loadedMatches = Array.isArray(parsed.matches) ? parsed.matches : initialMatches
      const normalizedMatches = loadedMatches.map((match: Match) => ({
        ...match,
        // Migrate old upcoming entries that were saved before status existed.
        status: match.status === 'played' && match.homeGoals === 0 && match.awayGoals === 0 ? 'upcoming' : (match.status ?? (match.homeGoals === 0 && match.awayGoals === 0 ? 'upcoming' : 'played')),
      }))
      const uniqueMatches = normalizedMatches.filter((match: Match, index: number, all: Match[]) => all.findIndex((candidate) => `${candidate.home}|${candidate.away}|${candidate.date}|${candidate.round}|${candidate.status}|${candidate.homeGoals}|${candidate.awayGoals}` === `${match.home}|${match.away}|${match.date}|${match.round}|${match.status}|${match.homeGoals}|${match.awayGoals}`) === index)
      const hasSavedTournament = typeof parsed.activeTournament === 'string' && tournamentData[parsed.activeTournament]
      const savedTournament = hasSavedTournament ? parsed.activeTournament : 'Champions League'
      const savedData = tournamentData[savedTournament]
      setActiveTournament(savedTournament)
      setPlayers(hasSavedTournament && Array.isArray(parsed.players) ? parsed.players : savedData.players)
      setMatches(hasSavedTournament ? uniqueMatches : savedData.matches)
      setPlayerStats(hasSavedTournament && parsed.playerStats && typeof parsed.playerStats === 'object' ? parsed.playerStats : {})
      setTeamGroups(hasSavedTournament && parsed.teamGroups && typeof parsed.teamGroups === 'object' ? parsed.teamGroups : {})
      if (hasSavedTournament && parsed.copaBracket && typeof parsed.copaBracket === 'object') setCopaBracket(parsed.copaBracket)
      if (hasSavedTournament && parsed.copaVisualBracket && typeof parsed.copaVisualBracket === 'object') setCopaVisualBracket(parsed.copaVisualBracket)
      if (hasSavedTournament && typeof parsed.copaChampion === 'string') setCopaChampion(parsed.copaChampion)
    }
    fetch('/api/league-state').then(async (response) => {
      if (!response.ok) throw new Error(`Persistence read failed: ${response.status}`)
      return response.json()
    }).then((data) => {
      const state = data.state
      if (state && typeof state === 'object') {
        if (typeof state.activeTournament === 'string' && tournamentData[state.activeTournament]) setActiveTournament(state.activeTournament)
        if (Array.isArray(state.players)) setPlayers(state.players)
        if (Array.isArray(state.matches)) setMatches(state.matches)
        if (state.playerStats && typeof state.playerStats === 'object') setPlayerStats(state.playerStats)
        if (state.teamGroups && typeof state.teamGroups === 'object') setTeamGroups(state.teamGroups)
        if (state.tournamentStates && typeof state.tournamentStates === 'object') setTournamentStates(state.tournamentStates)
        if (state.copaBracket && typeof state.copaBracket === 'object') setCopaBracket(state.copaBracket)
        if (state.copaVisualBracket && typeof state.copaVisualBracket === 'object') setCopaVisualBracket(state.copaVisualBracket)
        if (typeof state.copaChampion === 'string') setCopaChampion(state.copaChampion)
      }
      setPersistenceLoaded(true)
    }).catch(() => setPersistenceLoaded(true))
  }, [])
  useEffect(() => {
    const currentTournamentState = { players, matches, playerStats, teamGroups, copaBracket, copaVisualBracket, copaChampion }
  const allTournamentStates = { ...tournamentStates, [activeTournament]: currentTournamentState }
  const state = { activeTournament, players, matches, playerStats, teamGroups, tournamentStates: allTournamentStates, copaBracket, copaVisualBracket, copaChampion }
    window.localStorage.setItem('pes6-league', JSON.stringify(state))
    if (persistenceLoaded) {
      const payload = JSON.stringify(state)
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          const response = await fetch('/api/league-state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: payload })
          if (!response.ok) throw new Error(`Persistence failed: ${response.status}`)
        })
        .catch((error) => console.error('[v0] No se pudo guardar el estado:', error))
    }
  }, [activeTournament, players, matches, playerStats, teamGroups, tournamentStates, copaBracket, copaVisualBracket, copaChampion, persistenceLoaded])

  const table = useMemo(() => calculateTable(players, matches), [players, matches])
  const leader = table[0]
 const groupALeader = table.filter((team) => (teamGroups[team.id] ?? 'A') === 'A')[0]
   const groupBLeader = table.filter((team) => teamGroups[team.id] === 'B')[0]
  const playedMatches = matches.filter((match) => match.status === 'played')
  const totalGoals = playedMatches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0)
  const getPlayer = (id: string) => players.find((player) => player.id === id) ?? { name: 'Desconocido', initials: '?', color: 'bg-muted' }

  function addMatch(event: React.FormEvent) {
    event.preventDefault()
    if (home === away || !matchDate || !matchRound || homeGoals === '' || awayGoals === '') return

    const newMatch: Match = {
      id: Date.now(), home, away, homeGoals: Number(homeGoals), awayGoals: Number(awayGoals), date: matchDate, round: matchRound, status: 'played',
    }
    setMatches((currentMatches) => {
      const hasPlayedMatch = currentMatches.some((match) => match.home === home && match.away === away && match.date === matchDate && match.round === matchRound && match.status === 'played')
      if (hasPlayedMatch) return currentMatches
      const withoutUpcoming = currentMatches.filter((match) => !(match.home === home && match.away === away && match.date === matchDate && match.round === matchRound && match.status === 'upcoming'))
      return [newMatch, ...withoutUpcoming]
    })
    setHomeGoals(''); setAwayGoals(''); setMatchDate(''); setMatchRound(''); setShowForm(false)
  }

  function addUpcomingMatch(event: React.FormEvent) {
    event.preventDefault()
    if (home === away || !matchDate || !matchRound) return
    const newMatch: Match = { id: Date.now(), home, away, homeGoals: 0, awayGoals: 0, date: matchDate, round: matchRound, status: 'upcoming' }
    setMatches((currentMatches) => currentMatches.some((match) => match.home === home && match.away === away && match.date === matchDate && match.round === matchRound && match.status === 'upcoming') ? currentMatches : [newMatch, ...currentMatches])
    setMatchDate(''); setMatchRound(''); setShowForm(false)
  }

  function openUpcomingForm() {
    setMatchType('upcoming')
    setHomeGoals(''); setAwayGoals(''); setMatchDate(''); setMatchRound(''); setShowForm(true)
  }
  function addPlayer(event: React.FormEvent) {
    event.preventDefault()
    const name = playerName.trim()
    const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    if (!name || !id || players.some((player) => player.id === id)) return
    setPlayers((current) => [...current, { id, name, initials: name.slice(0, 2).toUpperCase(), color: 'bg-teal-500' }])
    if (['Copa América', 'Eurocopa'].includes(activeTournament)) setTeamGroups((current) => ({ ...current, [id]: newTeamGroup }))
    setPlayerName('')
  }

  function addTeam(event: React.FormEvent) {
    event.preventDefault()
    const name = newTeamName.trim()
    const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    if (!name || !id || players.some((player) => player.id === id)) return
    const newTeam = { id, name, initials: name.slice(0, 2).toUpperCase(), color: 'bg-teal-500' }
    setPlayers((current) => [...current, newTeam])
    if (['Copa América', 'Eurocopa'].includes(activeTournament)) setTeamGroups((current) => ({ ...current, [id]: newTeamGroup }))
    setSelectedTeamId(id)
    setNewTeamName('')
  }

  function removeTeam(teamId: string) {
    setPlayers((current) => current.filter((player) => player.id !== teamId))
    setPlayerStats((current) => { const next = { ...current }; delete next[teamId]; return next })
    setTeamGroups((current) => { const next = { ...current }; delete next[teamId]; return next })
    setMatches((current) => current.filter((match) => match.home !== teamId && match.away !== teamId))
    if (selectedTeamId === teamId) setSelectedTeamId(players.find((player) => player.id !== teamId)?.id ?? '')
  }

  function removeMatch(matchId: number) {
    setMatches((currentMatches) => currentMatches.filter((match) => match.id !== matchId))
  }

  function addPlayerStat(event: React.FormEvent) {
    event.preventDefault()
    const name = newPlayer.name.trim()
    if (!name) return
    const stat: PlayerStat = { id: `${Date.now()}-${name}`, name, goals: Number(newPlayer.goals) || 0, assists: Number(newPlayer.assists) || 0, penalties: Number(newPlayer.penalties) || 0, yellowCards: Number(newPlayer.yellowCards) || 0, redCards: Number(newPlayer.redCards) || 0, injuries: Number(newPlayer.injuries) || 0 }
    setPlayerStats((current) => ({ ...current, [selectedTeamId]: [...(current[selectedTeamId] ?? []), stat] }))
    setNewPlayer({ name: '', goals: '0', assists: '0', penalties: '0', yellowCards: '0', redCards: '0', injuries: '0' })
  }

  function updatePlayerStat(teamId: string, statId: string, field: keyof Omit<PlayerStat, 'id' | 'name'>, value: string) {
    setPlayerStats((current) => ({ ...current, [teamId]: (current[teamId] ?? []).map((stat) => stat.id === statId ? { ...stat, [field]: Math.max(0, Number(value) || 0) } : stat) }))
  }

  function removePlayerStat(teamId: string, statId: string) {
    setPlayerStats((current) => ({ ...current, [teamId]: (current[teamId] ?? []).filter((stat) => stat.id !== statId) }))
  }

  function selectTournament(tournament: string) {
    setTournamentStates((current) => ({ ...current, [activeTournament]: { players, matches, playerStats, teamGroups, copaBracket, copaVisualBracket, copaChampion } }))
    const selected = tournamentData[tournament]
    const savedState = tournamentStates[tournament]
    if (savedState?.copaBracket) setCopaBracket(savedState.copaBracket)
    if (savedState?.copaVisualBracket) setCopaVisualBracket(savedState.copaVisualBracket)
    if (typeof savedState?.copaChampion === 'string') setCopaChampion(savedState.copaChampion)
    const nextPlayers = savedState?.players ?? selected?.players ?? initialPlayers
    const nextMatches = (savedState?.matches ?? selected?.matches ?? initialMatches).map((match) => ({ ...match, status: match.status ?? 'played' as const }))
    setActiveTournament(tournament)
    setPlayers(nextPlayers)
    setMatches(nextMatches)
    setHome(nextPlayers[0].id)
    setAway(nextPlayers[1].id)
    setSelectedTeamId(nextPlayers[0].id)
    const nextGroups = savedState?.teamGroups ?? (['Copa América', 'Eurocopa'].includes(tournament) ? Object.fromEntries(nextPlayers.map((player, index) => [player.id, index < Math.ceil(nextPlayers.length / 2) ? 'A' : 'B'])) as Record<string, 'A' | 'B'> : {})
    setPlayerStats(savedState?.playerStats ?? {})
    setTeamGroups(nextGroups)
    window.localStorage.setItem('pes6-league', JSON.stringify({ activeTournament: tournament, players: nextPlayers, matches: nextMatches, playerStats: {}, teamGroups: nextGroups }))
    setActiveTab('overview')
  }

  return (
    <div className="min-h-screen bg-[#007a55] text-white">
      <header className="border-b border-[#159a72] bg-[#007a55] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-8">
          <div className="flex items-center"><img src="/promuertos-logo.jpg" alt="Promuertos" className="h-24 w-auto max-w-[480px] object-contain object-left mix-blend-screen brightness-125 contrast-125 sm:h-28 sm:max-w-[620px]" /></div>
          <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="border-white/40 bg-white text-[#007a55] hover:bg-emerald-50" onClick={() => { setMatchType('played'); setHomeGoals(''); setAwayGoals(''); setMatchDate(''); setMatchRound(''); setShowForm(true) }}><CirclePlus data-icon="inline-start" />Cargar resultado</Button></div>
        </div>
      </header>
      <main data-active-tab={activeTab} className="flex min-h-[calc(100vh-81px)] w-full flex-col gap-0 px-0 py-0 lg:flex-row [&_table]:w-full [&_table]:bg-[#004a34] [&_thead]:bg-[#003d2b] [&_tbody_tr]:border-[#159a72]/50 [&_tbody_tr]:bg-[#004a34]">
        <aside className="h-fit shrink-0 border-b border-[#159a72] bg-[#005c40] p-4 lg:sticky lg:top-0 lg:min-h-[calc(100vh-81px)] lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
          <div className="flex items-center gap-2 px-3 pb-3 pt-2"><Globe2 className="size-4 text-emerald-200" /><span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">Mis torneos</span></div>
          <nav aria-label="Navegación de torneos" className="flex gap-2 overflow-x-auto lg:flex-col">
            {['Champions League', 'Mundial', 'Eurocopa', 'Copa América'].map((tournament) => <button type="button" key={tournament} onClick={() => selectTournament(tournament)} className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors lg:w-full ${activeTournament === tournament ? 'bg-[#007a55] text-white shadow-sm' : 'text-emerald-100 hover:bg-[#004a34] hover:text-white'}`}><Trophy className="size-4" />{tournament}</button>)}
          </nav>
          <div className="mt-3 hidden border-t border-[#159a72]/50 px-3 pt-3 text-xs leading-relaxed text-emerald-200 lg:block">Seleccioná un torneo para consultar sus partidos y posiciones.</div>
        </aside>
        <div className="min-w-0 flex-1 px-4 py-7 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Torneo seleccionado</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{activeTournament}</h1><p className="mt-2 text-sm text-emerald-100">Resultados y posiciones de la liga de PES 6.</p></div><div className="flex items-center gap-2 rounded-xl border border-[#159a72] bg-[#005c40] p-1"><button onClick={() => setActiveTab('overview')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'overview' ? 'bg-[#007a55] text-white' : 'text-emerald-100'}`}><LayoutDashboard className="mr-1 inline size-4" />Resumen</button><button onClick={() => setActiveTab('matches')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'matches' ? 'bg-[#007a55] text-white' : 'text-emerald-100'}`}><ListOrdered className="mr-1 inline size-4" />Partidos</button><button onClick={() => setActiveTab('players')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'players' ? 'bg-[#007a55] text-white' : 'text-emerald-100'}`}><Shield className="mr-1 inline size-4" />Equipos</button></div></div>
        {showForm && <form onSubmit={matchType === 'upcoming' ? addUpcomingMatch : addMatch} className="mb-6 rounded-2xl border border-[#159a72] bg-[#005c40] p-5 text-white"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">{matchType === 'upcoming' ? 'Agregar próximo partido' : 'Cargar resultado'}</h2><p className="text-xs text-emerald-100">La tabla se actualiza automáticamente.</p></div><button type="button" onClick={() => setShowForm(false)} className="text-emerald-200" aria-label="Cerrar formulario">×</button></div><div className="mb-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-emerald-100">Fecha y hora<input type="text" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} placeholder="Ej: 20 Jun, 22:00" className="mt-1 block w-full rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-sm text-white placeholder:text-emerald-200" /></label><label className="text-xs font-bold text-emerald-100">Jornada<input type="text" value={matchRound} onChange={(e) => setMatchRound(e.target.value)} placeholder="Ej: Fecha 5" className="mt-1 block w-full rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-sm text-white placeholder:text-emerald-200" /></label></div><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end"><label className="text-xs font-bold text-emerald-100">Local<select value={home} onChange={(e) => setHome(e.target.value)} className="mt-1 block w-full rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-sm text-white">{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><input aria-label="Goles local"  inputMode="numeric" value={homeGoals} onChange={(e) => setHomeGoals(e.target.value)} className="w-full rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-center text-lg font-bold text-white placeholder:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40 sm:w-16" placeholder="0" /><label className="text-xs font-bold text-emerald-100">Visitante<select value={away} onChange={(e) => setAway(e.target.value)} className="mt-1 block w-full rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-sm text-white">{players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="flex items-center gap-2"><input aria-label="Goles visitante"  inputMode="numeric"  value={awayGoals} onChange={(e) => setAwayGoals(e.target.value)} className="w-16 rounded-lg border border-[#159a72] bg-[#004a34] p-2.5 text-center text-lg font-bold text-white placeholder:text-emerald-200" placeholder="0" /><Button type="submit">Guardar</Button></div></div></form>}
        {activeTab === 'overview' && <>{['Copa América', 'Eurocopa'].includes(activeTournament) && <CopaAmericaBracketVisual players={players} bracket={copaVisualBracket} onChange={setCopaVisualBracket} champion={copaChampion} onChampionChange={setCopaChampion} />}{['Copa América', 'Eurocopa'].includes(activeTournament) ? <section className="mt-6 mb-6 grid gap-4 sm:grid-cols-2"><LeaderCard label="Líder del Grupo A" leader={groupALeader} /><LeaderCard label="Líder del Grupo B" leader={groupBLeader} /></section> : null}{['Copa América', 'Eurocopa'].includes(activeTournament) ? <CopaAmericaGroups table={table} teamGroups={teamGroups} /> : <StandingsTable table={table} />}<PlayerLeaderboards players={players} playerStats={playerStats} expanded={expandedLeaderboard} onToggle={(key) => setExpandedLeaderboard((current) => ({ ...current, [key]: !current[key] }))} /></>}{false && activeTab === 'players' ? <section className="grid gap-5 md:grid-cols-[1fr_340px]"><div className="rounded-2xl border border-[#159a72] bg-[#005c40] p-5"><h2 className="mb-4 text-lg font-bold">Equipos <span className="text-sm font-normal text-emerald-200">{players.length} equipos</span></h2><div className="grid gap-3 sm:grid-cols-2">{players.map((player) => <div key={player.id} className="flex items-center justify-between rounded-xl border border-[#159a72]/50 p-3"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-full text-xs font-black text-white ${player.color}`}>{player.initials}</span><span className="font-semibold">{player.name}</span></div><button onClick={() => setPlayers(players.filter((p) => p.id !== player.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button></div>)}</div></div><form onSubmit={addPlayer} className="rounded-2xl border border-[#159a72] bg-[#005c40] p-5"><h2 className="mb-1 font-bold">Sumar equipo</h2><p className="mb-4 text-sm text-emerald-100">Agregá todos los equipos que quieras.</p><input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Nombre del equipo" className="mb-3 w-full rounded-lg border border-slate-200 p-2.5 text-sm" /><Button type="submit" className="w-full">Sumar equipo</Button></form></section> : <><UpcomingMatches players={players} matches={matches} getPlayer={getPlayer} onAddUpcoming={openUpcomingForm} /><section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl bg-[#005c40] p-5 text-white"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-300">Líder actual</span><Crown className="text-amber-400" /></div><p className="text-2xl font-black">{leader?.name}</p><p className="mt-1 text-sm text-emerald-200">{leader?.points} puntos · {leader?.played} partidos</p></div><StatCard label="Partidos jugados" value={playedMatches.length.toString()} icon={<CalendarDays />} /><StatCard label="Goles convertidos" value={totalGoals.toString()} icon={<Trophy />} /><StatCard label="Equipos" value={players.length.toString()} icon={<Shield />} /></section><div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]"><section className="rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="flex items-center justify-between border-b border-[#159a72]/50 px-5 py-4"><div><h2 className="font-bold">Tabla de posiciones</h2><p className="text-xs text-emerald-100">Ordenada por puntos y diferencia de gol</p></div><button className="text-emerald-200"><MoreHorizontal /></button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-emerald-200"><tr><th className="px-5 py-3">Pos</th><th className="px-2 py-3">Equipo</th><th className="px-2 py-3 text-center">PJ</th><th className="px-2 py-3 text-center">DG</th><th className="px-5 py-3 text-center">Pts</th></tr></thead><tbody>{table.map((team, index) => <tr key={team.id} className="border-t border-[#159a72]/50"><td className="px-5 py-3 font-bold text-emerald-200">{String(index + 1).padStart(2, '0')}</td><td className="px-2 py-3"><div className="flex items-center gap-2.5"><span className={`grid size-8 place-items-center rounded-lg text-[10px] font-black text-white ${team.color}`}>{team.initials}</span><span className="whitespace-nowrap font-semibold">{team.name}</span></div></td><td className="px-2 py-3 text-center text-emerald-100">{team.played}</td><td className={`px-2 py-3 text-center font-semibold ${team.gd > 0 ? 'text-emerald-600' : team.gd < 0 ? 'text-red-500' : 'text-emerald-200'}`}>{team.gd > 0 ? '+' : ''}{team.gd}</td><td className="px-5 py-3 text-center text-base font-black">{team.points}</td></tr>)}</tbody></table></div></section><section className="rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="flex items-center justify-between border-b border-[#159a72]/50 px-5 py-4"><div><h2 className="manual-results-title font-bold">Últimos resultados</h2><p className="text-xs text-emerald-100">Cargados manualmente</p></div><button onClick={() => setActiveTab('matches')} className="text-xs font-bold text-[#007a55]">Ver todos</button></div><div className="flex flex-col">{matches.slice(0, 4).map((match) => <div key={match.id} className="flex items-center justify-between border-b border-[#159a72]/50 px-5 py-4 last:border-0"><div><p className="text-xs text-emerald-200">{match.round} · {match.date}</p><div className="mt-2 flex items-center gap-2 text-sm font-semibold"><span>{getPlayer(match.home).name}</span><b className="rounded bg-[#004a34] px-2 py-1">{match.homeGoals} - {match.awayGoals}</b><span>{getPlayer(match.away).name}</span></div></div><Trash2 className="size-4 text-slate-300" /></div>)}</div></section></div></>}
        {activeTab === 'players' && <TeamStatsPanel teams={players} selectedTeamId={selectedTeamId} onSelectTeam={setSelectedTeamId} stats={playerStats[selectedTeamId] ?? []} newPlayer={newPlayer} setNewPlayer={setNewPlayer} onAdd={addPlayerStat} onUpdate={updatePlayerStat} onRemove={removePlayerStat} tournament={activeTournament} teamGroups={teamGroups} newTeamName={newTeamName} setNewTeamName={setNewTeamName} newTeamGroup={newTeamGroup} setNewTeamGroup={setNewTeamGroup} onAddTeam={addTeam} onRemoveTeam={removeTeam} />}{activeTab === 'matches' && <section className="mt-6 rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="border-b border-[#159a72]/50 px-5 py-4"><h2 className="font-bold">Todos los partidos</h2><p className="text-xs text-emerald-100">Historial completo de la competencia</p></div>{matches.filter((match) => match.status === 'played').map((match) => <div key={match.id} className="flex items-center justify-between border-b border-[#159a72]/50 px-5 py-4 last:border-0"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-full text-[10px] font-black text-white ${getPlayer(match.home).color}`}>{getPlayer(match.home).initials}</span><span className="text-sm font-semibold">{getPlayer(match.home).name}</span><strong className="rounded-lg bg-[#004a34] px-3 py-1.5">{match.homeGoals} - {match.awayGoals}</strong><span className="text-sm font-semibold">{getPlayer(match.away).name}</span><span className={`grid size-9 place-items-center rounded-full text-[10px] font-black text-white ${getPlayer(match.away).color}`}>{getPlayer(match.away).initials}</span></div><div className="flex items-center gap-3"><div className="hidden text-right text-xs text-emerald-200 sm:block"><span className="block">{match.date}</span><span className="block font-semibold">{match.round}</span></div><button type="button" onClick={() => removeMatch(match.id)} aria-label={`Eliminar resultado de ${getPlayer(match.home).name} y ${getPlayer(match.away).name}`} className="rounded-lg p-2 text-emerald-200 transition-colors hover:bg-red-500/15 hover:text-red-300"><Trash2 className="size-4" /></button></div></div>)}</section>}
        </div>
      </main>
      <footer className="flex w-full items-center justify-between px-4 pb-7 text-xs text-emerald-200 sm:px-8 lg:px-10 xl:px-12"><span>Los datos se guardan solo en este navegador.</span><span className="flex items-center gap-1"><Settings2 className="size-3" /> Liga privada</span></footer>
    </div>
  )
}

function CopaAmericaGroups({ table, teamGroups }: { table: ReturnType<typeof calculateTable>; teamGroups: Record<string, 'A' | 'B'> }) {
  const renderGroup = (name: string, teams: typeof table) => <section className="overflow-hidden rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="border-b border-[#159a72]/50 px-5 py-4"><h2 className="font-bold">{name}</h2><p className="text-xs text-emerald-100">Clasificación del grupo</p></div><div className="overflow-x-auto"><table className="copa-group-table w-full min-w-[680px] text-left text-sm"><thead className="bg-[#003d2b] text-xs uppercase tracking-wider text-emerald-200"><tr><th className="px-5 py-3">Pos</th><th className="px-5 py-3">Equipo</th><th className="px-5 py-3 text-center">PTS</th><th className="px-5 py-3 text-center">PJ</th><th className="px-5 py-3 text-center">+/-</th><th className="px-5 py-3 text-center">G</th><th className="px-5 py-3 text-center">E</th><th className="px-5 py-3 text-center">P</th></tr></thead><tbody>{teams.map((team, index) => <tr key={team.id} className="border-t border-[#159a72]/40"><td className="px-5 py-4"><span className={`inline-flex size-7 items-center justify-center rounded-full font-bold ${index < 2 ? 'bg-sky-500 text-white' : 'text-emerald-200'}`}>{index + 1}</span></td><td className="px-5 py-4 font-bold"><span className="mr-2" aria-hidden="true">{countryFlag(team.name)}</span>{team.name}</td><td className="px-5 py-4 text-center font-black">{team.points}</td><td className="px-5 py-4 text-center">{team.played}</td><td className={`px-5 py-4 text-center font-bold ${team.gd > 0 ? 'text-emerald-300' : team.gd < 0 ? 'text-red-300' : 'text-white'}`}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td><td className="px-5 py-4 text-center">{team.won}</td><td className="px-5 py-4 text-center">{team.drawn}</td><td className="px-5 py-4 text-center">{team.lost}</td></tr>)}</tbody></table></div><div className="flex items-center gap-2 border-t border-[#159a72]/50 bg-[#003d2b] px-5 py-3 text-sm font-bold"><span className="size-3 rounded-full bg-sky-400" />Semifinales</div></section>;
  const groupA = table.filter((team) => (teamGroups[team.id] ?? 'A') === 'A')
  const groupB = table.filter((team) => teamGroups[team.id] === 'B')
  return <section className="grid gap-5 lg:grid-cols-2">{renderGroup('Grupo A', groupA)}{renderGroup('Grupo B', groupB)}</section>
}

function StandingsTable({ table }: { table: ReturnType<typeof calculateTable> }) {
  return <section className="standings-table mb-6 overflow-hidden rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="border-b border-[#159a72]/50 px-5 py-4"><h2 className="font-bold">Tabla de posiciones</h2><p className="text-xs text-emerald-100">Rendimiento acumulado por equipo</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#003d2b] text-xs uppercase tracking-wider text-emerald-200"><tr><th className="px-5 py-3">Pos</th><th className="px-5 py-3">Equipo</th><th className="px-5 py-3 text-center">PTS</th><th className="px-5 py-3 text-center">PJ</th><th className="px-5 py-3 text-center">+/-</th><th className="px-5 py-3 text-center">G</th><th className="px-5 py-3 text-center">E</th><th className="px-5 py-3 text-center">P</th></tr></thead><tbody>{table.map((team, index) => <tr key={team.id} className="border-t border-[#159a72]/40"><td className="px-5 py-4 font-bold text-emerald-200">{index + 1}</td><td className="px-5 py-4 font-bold"><span className="mr-2" aria-hidden="true">{countryFlag(team.name)}</span>{team.name}</td><td className="px-5 py-4 text-center font-black">{team.points}</td><td className="px-5 py-4 text-center">{team.played}</td><td className={`px-5 py-4 text-center font-bold ${team.gd > 0 ? 'text-emerald-300' : team.gd < 0 ? 'text-red-300' : 'text-white'}`}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td><td className="px-5 py-4 text-center">{team.won}</td><td className="px-5 py-4 text-center">{team.drawn}</td><td className="px-5 py-4 text-center">{team.lost}</td></tr>)}</tbody></table></div></section>
}

function CopaAmericaBracket({ players, bracket, onChange }: { players: Player[]; bracket: CopaBracket; onChange: React.Dispatch<React.SetStateAction<CopaBracket>> }) {
  const update = (match: keyof CopaBracket, field: keyof BracketMatch, value: string) => onChange((current) => ({ ...current, [match]: { ...current[match], [field]: value } }))
  const matchCard = (title: string, key: keyof CopaBracket) => { const match = bracket[key]; return <div className="rounded-xl border border-[#159a72]/60 bg-[#004a34] p-4"><h3 className="mb-3 font-bold">{title}</h3><div className="grid gap-2 sm:grid-cols-[1fr_70px_70px_1fr]"><select aria-label={`${title} equipo local`} value={match.home} onChange={(e) => update(key, 'home', e.target.value)} className="rounded-lg border border-[#159a72] bg-[#005c40] p-2 text-sm text-white"><option value="">Elegir equipo</option>{players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select><input aria-label={`${title} goles local`} type="number" min="0" value={match.homeGoals} onChange={(e) => update(key, 'homeGoals', e.target.value)} placeholder="0" className="rounded-lg border border-[#159a72] bg-[#005c40] p-2 text-center text-white" /><input aria-label={`${title} goles visitante`} type="number" min="0" value={match.awayGoals} onChange={(e) => update(key, 'awayGoals', e.target.value)} placeholder="0" className="rounded-lg border border-[#159a72] bg-[#005c40] p-2 text-center text-white" /><select aria-label={`${title} equipo visitante`} value={match.away} onChange={(e) => update(key, 'away', e.target.value)} className="rounded-lg border border-[#159a72] bg-[#005c40] p-2 text-sm text-white"><option value="">Elegir equipo</option>{players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select></div></div> }
  return <section className="mt-6 rounded-2xl border border-[#159a72] bg-[#005c40] p-5"><div className="mb-4"><h2 className="text-lg font-bold">Cuadro de eliminación</h2><p className="text-xs text-emerald-100">Completá los equipos y resultados de semifinales y final.</p></div><div className="grid gap-5 lg:grid-cols-3"><div><p className="mb-2 text-sm font-bold text-emerald-200">Semifinales</p><div className="space-y-3">{matchCard('Semifinal 1', 'semifinal1')}{matchCard('Semifinal 2', 'semifinal2')}</div></div><div className="lg:col-span-2"><p className="mb-2 text-sm font-bold text-emerald-200">Final</p>{matchCard('Final', 'final')}</div></div></section>
}

function CopaAmericaBracketVisual({ players, bracket, onChange, champion, onChampionChange }: { players: Player[]; bracket: CopaVisualBracket; onChange: React.Dispatch<React.SetStateAction<CopaVisualBracket>>; champion: string; onChampionChange: (value: string) => void }) {
  const update = (round: keyof CopaVisualBracket, index: number | null, field: keyof BracketMatch, value: string) => onChange((current) => { const source = current[round]; if (Array.isArray(source)) return { ...current, [round]: source.map((match, matchIndex) => matchIndex === index ? { ...match, [field]: value } : match) }; return { ...current, [round]: { ...source, [field]: value } } })
  const selectedPlayer = (id: string) => players.find((player) => player.id === id)
  const matchCard = (round: keyof CopaVisualBracket, index: number | null, label: string) => { const source = bracket[round]; const match = Array.isArray(source) ? source[index ?? 0] : source; const homeGoals = Number(match.homeGoals); const awayGoals = Number(match.awayGoals); const homePenalties = Number(match.homePenalties); const awayPenalties = Number(match.awayPenalties); const winnerId = homeGoals > awayGoals || (homeGoals === awayGoals && homePenalties > awayPenalties) ? match.home : awayGoals > homeGoals || (awayGoals === homeGoals && awayPenalties > homePenalties) ? match.away : ''; return <div className="bracket-match rounded-lg bg-[#075d2d] p-2.5 shadow-sm"><div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">{label}</div><div className="grid grid-cols-[minmax(0,1fr)_34px] items-center gap-1"><div className="flex min-w-0 items-center gap-1"><span className="shrink-0">{selectedPlayer(match.home) ? countryFlag(selectedPlayer(match.home)!.name) : null}</span><select aria-label={`${label} equipo local`} value={match.home} onChange={(event) => update(round, index, 'home', event.target.value)} className={`min-w-0 bg-transparent text-sm text-white outline-none ${winnerId === match.home && match.home ? 'font-bold text-yellow-300' : 'font-semibold'}`}><option value="" className="bg-[#005c40]">Elegir equipo</option>{players.map((player) => <option key={player.id} value={player.id} className="bg-[#005c40]">{player.name}</option>)}</select></div><input aria-label={`${label} goles local`} type="number" min="0" value={match.homeGoals} onChange={(event) => update(round, index, 'homeGoals', event.target.value)} placeholder="-" className="w-full rounded bg-[#064522] px-1 py-1 text-center text-sm font-black text-amber-300 outline-none" /><div className="flex min-w-0 items-center gap-1"><span className="shrink-0">{selectedPlayer(match.away) ? countryFlag(selectedPlayer(match.away)!.name) : null}</span><select aria-label={`${label} equipo visitante`} value={match.away} onChange={(event) => update(round, index, 'away', event.target.value)} className={`min-w-0 bg-transparent text-sm text-emerald-100 outline-none ${winnerId === match.away && match.away ? 'font-bold text-yellow-300' : 'font-semibold'}`}><option value="" className="bg-[#005c40]">Elegir equipo</option>{players.map((player) => <option key={player.id} value={player.id} className="bg-[#005c40]">{player.name}</option>)}</select></div><input aria-label={`${label} goles visitante`} type="number" min="0" value={match.awayGoals} onChange={(event) => update(round, index, 'awayGoals', event.target.value)} placeholder="-" className="w-full rounded bg-[#064522] px-1 py-1 text-center text-sm font-black text-amber-300 outline-none" /></div><div className="mt-2 flex items-center justify-center gap-2 text-xs text-amber-200"><span>(</span><input aria-label={`${label} penales local`} type="number" min="0" value={match.homePenalties ?? ''} onChange={(event) => update(round, index, 'homePenalties', event.target.value)} placeholder="0" className="w-12 rounded bg-[#064522] px-1 py-1 text-center text-xs text-amber-200 outline-none" /><span>) - (</span><input aria-label={`${label} penales visitante`} type="number" min="0" value={match.awayPenalties ?? ''} onChange={(event) => update(round, index, 'awayPenalties', event.target.value)} placeholder="0" className="w-12 rounded bg-[#064522] px-1 py-1 text-center text-xs text-amber-200 outline-none" /><span>)</span></div></div> }
  const column = (title: string, round: 'semifinals' | 'final', labels: string[]) => <div className={`flex min-w-[280px] flex-1 flex-col ${round === 'semifinals' ? 'justify-center gap-8' : 'justify-center'}`}><h3 className="mb-3 text-center text-lg font-black uppercase text-white">{title}</h3>{labels.map((label, index) => <div key={label}>{matchCard(round, round === 'final' ? null : index, label)}</div>)}</div>
  return <section className="mt-6 overflow-hidden rounded-2xl border border-[#103e2d] bg-[#06291e] p-4 sm:p-6"><div className="mb-5"><h2 className="text-xl font-black text-white">Cuadro de eliminación</h2><p className="text-xs text-emerald-200">Semifinales y final. Si hay empate, puedes registrar los penales.</p></div><div className="bracket-scroll overflow-x-auto pb-4"><div className="mx-auto flex max-w-[900px] min-w-[620px] items-stretch justify-center gap-8">{column('Semifinales', 'semifinals', ['Semifinal 1', 'Semifinal 2'])}{column('Final', 'final', ['Final'])}<div className="flex min-w-[220px] flex-1 flex-col justify-center"><h3 className="mb-3 text-center text-lg font-black uppercase text-white">Campeón</h3><div className="rounded-lg border border-amber-400/50 bg-[#075d2d] p-4"><label className="text-xs font-bold uppercase tracking-wide text-amber-300">Elegir campeón<select aria-label="Elegir campeón Copa América" value={champion} onChange={(event) => onChampionChange(event.target.value)} className="mt-2 w-full rounded-lg border border-[#159a72] bg-[#005c40] p-2 text-sm font-bold text-white"><option value="">Elegir equipo</option>{players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select></label></div></div></div></div></section>
}

function PlayerLeaderboards({ players, playerStats, expanded, onToggle }: { players: Player[]; playerStats: Record<string, PlayerStat[]>; expanded: { goals: boolean; assists: boolean }; onToggle: (key: 'goals' | 'assists') => void }) {
  const entries = (field: 'goals' | 'assists') => players.flatMap((team) => (playerStats[team.id] ?? []).filter((player) => player[field] > 0).map((player) => ({ ...player, team: team.name }))).sort((a, b) => b[field] - a[field] || a.name.localeCompare(b.name))
  const renderBoard = (title: string, field: 'goals' | 'assists', label: string) => {
    const rows = entries(field)
    const visibleRows = expanded[field] ? rows : rows.slice(0, 5)
    return <section className="overflow-hidden rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="border-b border-[#159a72]/50 px-5 py-4"><h2 className="font-bold">{title}</h2><p className="text-xs text-emerald-100">Top de la competencia</p></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-[#003d2b] text-xs uppercase tracking-wider text-emerald-200"><tr><th className="px-5 py-3">Pos</th><th className="px-5 py-3">Jugador</th><th className="px-5 py-3 text-center">{label}</th></tr></thead><tbody>{visibleRows.map((player, index) => <tr key={`${field}-${player.id}`} className="border-t border-[#159a72]/40"><td className="px-5 py-3 font-bold text-emerald-200">{index + 1}</td><td className="px-5 py-3 font-semibold"><span className="inline-flex items-center">{countryFlag(player.team)}{player.name}</span></td><td className="px-5 py-3 text-center font-black">{player[field]}</td></tr>)}{rows.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-emerald-200">Todavía no hay jugadores con {field === 'goals' ? 'goles' : 'asistencias'} registrados.</td></tr>}</tbody></table></div>{rows.length > 5 && <button type="button" onClick={() => onToggle(field)} className="w-full border-t border-[#159a72]/50 px-5 py-3 text-sm font-bold text-emerald-100 hover:bg-[#004a34]">{expanded[field] ? 'Ver menos' : 'Ver más'}</button>}</section>
  }
  return <section className="mt-6 grid gap-5 lg:grid-cols-2">{renderBoard('Tabla de goleadores', 'goals', 'Goles')}{renderBoard('Tabla de asistencias', 'assists', 'Asistencias')}</section>
}

function LeaderCard({ label, leader }: { label: string; leader?: ReturnType<typeof calculateTable>[number] }) { return <div className="rounded-2xl bg-[#005c40] p-5 text-white"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-emerald-100">{label}</span><Crown className="text-amber-400" /></div><p className="text-2xl font-black">{leader?.name ?? 'Sin líder'}</p><p className="mt-1 text-sm text-emerald-200">{leader ? `${leader.points} puntos · ${leader.played} partidos` : 'Todavía no hay resultados'}</p></div> }

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="rounded-2xl border border-[#159a72] bg-[#005c40] p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-emerald-100">{label}</span><span className="text-[#007a55]">{icon}</span></div><p className="text-3xl font-black tracking-tight">{value}</p></div> }

function TeamStatsPanel({ teams, selectedTeamId, onSelectTeam, stats, newPlayer, setNewPlayer, onAdd, onUpdate, onRemove, tournament, teamGroups, newTeamName, setNewTeamName, newTeamGroup, setNewTeamGroup, onAddTeam, onRemoveTeam }: { teams: Player[]; selectedTeamId: string; onSelectTeam: (id: string) => void; stats: PlayerStat[]; newPlayer: { name: string; goals: string; assists: string; penalties: string; yellowCards: string; redCards: string; injuries: string }; setNewPlayer: React.Dispatch<React.SetStateAction<{ name: string; goals: string; assists: string; penalties: string; yellowCards: string; redCards: string; injuries: string }>>; onAdd: (event: React.FormEvent) => void; onUpdate: (teamId: string, statId: string, field: keyof Omit<PlayerStat, 'id' | 'name'>, value: string) => void; onRemove: (teamId: string, statId: string) => void; tournament: string; teamGroups: Record<string, 'A' | 'B'>; newTeamName: string; setNewTeamName: (value: string) => void; newTeamGroup: 'A' | 'B'; setNewTeamGroup: (value: 'A' | 'B') => void; onAddTeam: (event: React.FormEvent) => void; onRemoveTeam: (id: string) => void }) {
  const fields: { key: keyof Omit<PlayerStat, 'id' | 'name'>; label: string }[] = [{ key: 'goals', label: 'Goles' }, { key: 'assists', label: 'Asist.' }, { key: 'penalties', label: 'Penales' }, { key: 'yellowCards', label: 'TA' }, { key: 'redCards', label: 'TR' }, { key: 'injuries', label: 'Lesiones' }]
  return <section className="space-y-5"><form onSubmit={onAddTeam} className="flex flex-wrap items-end gap-2 rounded-2xl border border-[#159a72] bg-[#005c40] p-4"><label className="flex-1 text-xs font-bold text-emerald-100">Nuevo equipo<input required value={newTeamName} onChange={(event) => setNewTeamName(event.target.value)} placeholder="Nombre del equipo" className="mt-1 block w-full rounded-lg border border-[#159a72] bg-[#004a34] px-3 py-2.5 text-sm text-white placeholder:text-emerald-200" /></label>{['Copa América', 'Eurocopa'].includes(tournament) && <label className="text-xs font-bold text-emerald-100">Grupo<select value={newTeamGroup} onChange={(event) => setNewTeamGroup(event.target.value as 'A' | 'B')} className="mt-1 block rounded-lg border border-[#159a72] bg-[#004a34] px-3 py-2.5 text-sm text-white"><option value="A">Grupo A</option><option value="B">Grupo B</option></select></label>}<Button type="submit" size="sm" className="bg-[#007a55] text-white hover:bg-[#006646]"><CirclePlus data-icon="inline-start" />Agregar equipo</Button></form><div className="grid gap-5 xl:grid-cols-[240px_1fr]"><div className="rounded-2xl border border-[#159a72] bg-[#005c40] p-4"><h2 className="mb-3 font-bold">Equipos</h2><div className="flex gap-2 overflow-x-auto xl:flex-col">{teams.map((team) => <div key={team.id} className="flex items-center gap-2"><button type="button" onClick={() => onSelectTeam(team.id)} className={`flex min-w-max flex-1 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${selectedTeamId === team.id ? 'bg-[#007a55] text-white' : 'text-emerald-100 hover:bg-[#004a34]'}`}><span className={`grid size-8 place-items-center rounded-full text-[10px] font-black ${team.color}`}>{team.initials}</span><span className="mr-2" aria-hidden="true">{countryFlag(team.name)}</span>{team.name}{['Copa América', 'Eurocopa'].includes(tournament) && <span className="ml-auto text-xs text-emerald-200">Grupo {teamGroups[team.id] ?? 'A'}</span>}</button><button type="button" onClick={() => onRemoveTeam(team.id)} aria-label={`Eliminar equipo ${team.name}`} className="rounded-lg p-2 text-emerald-200 hover:bg-red-500/15 hover:text-red-300"><Trash2 className="size-4" /></button></div>)}</div></div><div className="rounded-2xl border border-[#159a72] bg-[#005c40] p-5"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold">Estadísticas de {teams.find((team) => team.id === selectedTeamId)?.name}</h2><p className="text-sm text-emerald-100">Agregá jugadores y actualizá sus datos después de cada partido.</p></div><form onSubmit={onAdd} className="flex flex-wrap gap-2"><input required value={newPlayer.name} onChange={(event) => setNewPlayer((current) => ({ ...current, name: event.target.value }))} placeholder="Nombre del jugador" className="rounded-lg border border-[#159a72] bg-[#004a34] px-3 py-2 text-sm text-white placeholder:text-emerald-200" />{fields.map((field) => <input key={field.key} type="number" min="0" aria-label={field.label} value={newPlayer[field.key]} onChange={(event) => setNewPlayer((current) => ({ ...current, [field.key]: event.target.value }))} className="w-20 rounded-lg border border-[#159a72] bg-[#004a34] px-2 py-2 text-center text-sm text-white" />)}<Button type="submit" size="sm" className="bg-[#007a55] text-white hover:bg-[#006646]"><CirclePlus data-icon="inline-start" />Agregar</Button></form></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#003d2b] text-xs uppercase tracking-wider text-emerald-200"><tr><th className="px-4 py-3">Jugador</th>{fields.map((field) => <th key={field.key} className="px-3 py-3 text-center">{field.label}</th>)}<th className="px-3 py-3 text-center">Acción</th></tr></thead><tbody>{stats.map((stat) => <tr key={stat.id} className="border-t border-[#159a72]/40"><td className="px-4 py-3 font-bold">{stat.name}</td>{fields.map((field) => <td key={field.key} className="px-2 py-2 text-center"><input type="number" min="0" aria-label={`${field.label} de ${stat.name}`} value={stat[field.key]} onChange={(event) => onUpdate(selectedTeamId, stat.id, field.key, event.target.value)} className="w-16 rounded-md border border-[#159a72] bg-[#004a34] px-2 py-1 text-center text-white" /></td>)}<td className="px-3 py-2 text-center"><button type="button" onClick={() => onRemove(selectedTeamId, stat.id)} aria-label={`Eliminar a ${stat.name}`} className="text-emerald-200 hover:text-red-300"><Trash2 className="size-4" /></button></td></tr>)}</tbody></table>{stats.length === 0 && <p className="p-8 text-center text-sm text-emerald-200">Todavía no hay jugadores cargados para este equipo.</p>}</div></div></div></section>
}

function UpcomingMatches({ players, matches, getPlayer, onAddUpcoming }: { players: Player[]; matches: Match[]; getPlayer: (id: string) => Player | { name: string; initials: string; color: string }; onAddUpcoming: () => void }) {
  const upcoming = matches.filter((match) => match.status === 'upcoming')
  return <section className="upcoming-matches mb-6 overflow-hidden rounded-2xl border border-[#159a72] bg-[#005c40]"><div className="flex flex-col gap-3 border-b border-[#159a72]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">Próximos partidos</h2><p className="text-xs text-emerald-100">Partidos programados para las próximas fechas.</p></div><button type="button" onClick={onAddUpcoming} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#007a55] px-3 py-2 text-sm font-bold text-white hover:bg-[#006646]"><CirclePlus className="size-4" />Agregar próximo partido</button></div><div className="overflow-x-auto"><table className="copa-group-table w-full min-w-[680px] text-left text-sm"><thead><tr className="text-xs uppercase tracking-wider text-emerald-200"><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Local</th><th className="px-5 py-3 text-center">vs</th><th className="px-5 py-3">Visitante</th><th className="px-5 py-3">Jornada</th></tr></thead><tbody>{upcoming.map((match, index) => <tr key={`${match.home}-${match.away}-${index}`} className="border-t border-[#159a72]/40"><td className="px-5 py-4 font-semibold text-emerald-100">{match.date}</td><td className="px-5 py-4 font-bold">{getPlayer(match.home).name}</td><td className="px-5 py-4 text-center font-black text-emerald-200">VS</td><td className="px-5 py-4 font-bold">{getPlayer(match.away).name}</td><td className="px-5 py-4 text-emerald-200">{match.round}</td></tr>)}</tbody></table></div></section>
}
