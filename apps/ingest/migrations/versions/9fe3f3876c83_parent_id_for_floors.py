"""parent id for floors

Revision ID: 9fe3f3876c83
Revises: c6dcf1d9569c
Create Date: 2025-02-23 00:13:01.254554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9fe3f3876c83'
down_revision: Union[str, None] = 'c6dcf1d9569c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        'floor',
        sa.Column(
            'building_id',
            sa.Integer(),
            sa.ForeignKey('building.id'),
            nullable=True
        )
    )

def downgrade():
    op.drop_column('floor', 'building_id')
