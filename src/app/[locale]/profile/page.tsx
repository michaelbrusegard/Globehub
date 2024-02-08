import { unstable_setRequestLocale } from 'next-intl/server';

export default function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return (
    <div className='h-[150vh]'>
      <h2>Profile Page</h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni delectus
        cupiditate debitis! Fuga minus quod ea eligendi exercitationem. Sequi
        quia possimus quaerat ipsa iste voluptatibus repudiandae atque cum sunt
        vitae. Soluta repellendus fuga minima itaque voluptate ad exercitationem
        dolore unde amet ex atque cum, consectetur dolores qui quas doloribus
        perferendis architecto optio sed mollitia accusamus tenetur fugiat
        eveniet quo? Autem! Dolores esse sint ratione consequatur cumque
        necessitatibus quam corporis perferendis facere consectetur quidem et
        ex, repudiandae tenetur neque qui. Sequi, odio praesentium. Blanditiis
        quo facilis natus quia repellat velit eos. Commodi quo minima eveniet
        voluptates ratione ipsam, a dolore aspernatur alias officiis ex cum
        laborum, esse culpa laudantium atque! Iure culpa, tenetur ad impedit
        optio reiciendis maiores delectus accusantium officiis? Quaerat
        provident laboriosam voluptatibus cum nam asperiores culpa libero totam
        sapiente quisquam sint exercitationem aliquam quidem, laudantium illo
        ullam similique. Impedit assumenda dolores, quia blanditiis excepturi
        qui architecto veritatis quas! Laboriosam illum, possimus nisi dolores,
      </p>
    </div>
  );
}
