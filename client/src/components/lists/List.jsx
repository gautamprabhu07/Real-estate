import "./list.scss";
import Card from "../card/Card";

function List({ posts }) {
  return (
    <section className="list">
      {posts && posts.length > 0 ? (
        posts.map((item) => <Card key={item.id} item={item} />)
      ) : (
        <p className="list__empty">No items to display yet.</p>
      )}
    </section>
  );
}

export default List;
