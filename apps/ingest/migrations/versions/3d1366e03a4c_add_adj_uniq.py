"""add adj uniq

Revision ID: 3d1366e03a4c
Revises: 109b1147833b
Create Date: 2025-02-16 21:35:40.464749

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d1366e03a4c'
down_revision: Union[str, None] = '109b1147833b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('uix_adjacency_node_edge', 'adjacency', ['node_id', 'edge_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uix_adjacency_node_edge', 'adjacency', type_='unique')
    # ### end Alembic commands ###
