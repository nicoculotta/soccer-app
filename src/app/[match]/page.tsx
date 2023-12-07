export default function MatchPage({ params }: { params: { match: string } }) {
  console.log(params);
  return <h1>Lista de players: {params.match} </h1>;
}
